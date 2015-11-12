
import {join} from 'path';
import {Router} from 'express';
import fm from 'front-matter';
import loadtest from 'loadtest';
import url from 'url';
import fs from '../utils/fs';
import benchrest from 'bench-rest';


const router = new Router();

router.post('/bench', async(req, res, next) => {
	try {
		let benchOptions = req.body;
		if (!benchOptions.method){
			benchOptions.method = 'GET';
		} else {
			benchOptions.method = benchOptions.method.toUpperCase();
		}

		let endpoint = url.format({
			protocol: benchOptions.protocol || 'http',
			host: benchOptions.host,
			port: benchOptions.port || 80,
			pathname: benchOptions.path,
			query: benchOptions.params
		});

		const runOptions = {
			limit: benchOptions.limit,     // concurrent connections
			iterations: benchOptions.iterations  // number of iterations to perform
		};

		let options = {
			url: endpoint,
			concurrency: benchOptions.limit,
			maxRequests: benchOptions.iterations,
			method: benchOptions.method,
			statusCallback: function(result){
				console.log(result);
				res.status(200).send(result);
			}
		};

		if (benchOptions.method === 'POST' && benchOptions.body) {
			options.body = benchOptions.body;
		}

		loadtest.loadTest(options, function(err) {
			if (err) {
				console.error(err);
				return;
			}
			console.log('tests run successfully');
		});

		// let errors = [];
		// benchrest(flow, runOptions).on('error', (err) => {
		// 	errors.push(err);
		// }).on('progress', (stats, percent) => {
		// 	console.log('Percent completed: %s', percent);
		// }).on('end', (stats, errorCount) => {
		// 	res.status(200).send({stats: stats, errCount: errorCount});
		// });
	} catch (err) {
		next(err);
	}
});

router.post('/bench_old', async(req, res, next) => {
	try {
		let benchOptions = req.body;
		if (!benchOptions.method){
			benchOptions.method = 'GET';
		} else {
			benchOptions.method = benchOptions.method.toUpperCase();
		}

		let endpoint = url.format({
			protocol: benchOptions.protocol || 'http',
			host: benchOptions.host,
			port: benchOptions.port || 80,
			pathname: benchOptions.path,
			query: benchOptions.params
		});
		let flow = {
			main: [
				{
					method: benchOptions.method,
					uri: endpoint
				}
			]
		};

		if (benchOptions.method === 'POST' && benchOptions.body) {
			flow.main.json = benchOptions.body;
		}

		const runOptions = {
			limit: benchOptions.limit,     // concurrent connections
			iterations: benchOptions.iterations  // number of iterations to perform
		};

		let errors = [];
		benchrest(flow, runOptions).on('error', (err) => {
			errors.push(err);
		}).on('progress', (stats, percent) => {
			console.log('Percent completed: %s', percent);
		}).on('end', (stats, errorCount) => {
			res.status(200).send({stats: stats, errCount: errorCount});
		});
	} catch (err) {
		next(err);
	}
});

export default router;
