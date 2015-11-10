
import {join} from 'path';
import {Router} from 'express';
import jade from 'jade';
import fm from 'front-matter';
import url from 'url';
import fs from '../utils/fs';
import benchrest from 'bench-rest';

// A folder with Jade/Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, './content');

// Extract 'front matter' metadata and generate HTML
const parseJade = (path, jadeContent) => {
	const fmContent = fm(jadeContent);
	const htmlContent = jade.render(fmContent.body);
	return Object.assign({
		path, content: htmlContent,
	}, fmContent.attributes);
};

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

router.get('/', async(req, res, next) => {
	try {
		const path = req.query.path;

		if (!path || path === 'undefined') {
			res.status(400).send({
				error: `The 'path' query parameter cannot be empty.`
			});
			return;
		}

		let fileName = join(CONTENT_DIR, (path === '/' ? '/index' : path) + '.jade');
		if (!await fs.exists(fileName)) {
			fileName = join(CONTENT_DIR, path + '/index.jade');
		}

		if (!await fs.exists(fileName)) {
			res.status(404).send({
				error: `The page '${path}' is not found.`
			});
		} else {
			const source = await fs.readFile(fileName, {
				encoding: 'utf8'
			});
			const content = parseJade(path, source);
			res.status(200).send(content);
		}
	} catch (err) {
		next(err);
	}
});

export default router;
