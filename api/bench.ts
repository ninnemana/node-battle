
import {Router} from 'express';
import url from 'url';
import benchrest from 'bench-rest';

const router = new Router();

router.post('/bench', async(req, res, next) => {
	try {
		let benchOptions = req.body;
		if (!benchOptions.method) {
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
