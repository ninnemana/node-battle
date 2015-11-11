var _ = require('lodash');
var benchrest = require('bench-rest');
var url = require('url');

// Get list of benchs
exports.index = function (req, res) {
	try {
		var benchOptions = req.body;
		if (!benchOptions.method) {
			benchOptions.method = 'GET';
		} else {
			benchOptions.method = benchOptions.method.toUpperCase();
		}

        var params = {};
        var limit = 10;
        var iterations = 100;
        for (var i = 0; i < benchOptions.params.length; i++) {
            var p = benchOptions.params[i];
            if (p.key === 'limit'){
                limit = p.value;
            } else if (p.key === 'iterations'){
                iterations = p.value;
            }else {
                params[p.key] = p.value;
            }
        }

		var endpoint = url.format({
			protocol: benchOptions.protocol || 'http:',
			host: benchOptions.host,
			port: benchOptions.port || 80,
			pathname: benchOptions.path,
			query: params
		});
		var flow = {
			main: [{
				method: benchOptions.method,
				uri: endpoint
			}]
		};

		if (benchOptions.method === 'POST' && benchOptions.body) {
			flow.main.json = benchOptions.body;
		}

		var runOptions = {
			limit: limit, // concurrent connections
			iterations: iterations // number of iterations to perform
		};

		var errors = [];
        console.log(flow, runOptions);
		benchrest(flow, runOptions).on('error', function (err) {
			errors.push(err);
		}).on('progress', function (stats, percent) {
			console.log('Percent completed: %s', percent);
		}).on('end', function (stats, errorCount) {
			res.status(200).json({
				stats: stats,
				errCount: errorCount
			});
		});
	} catch (err) {
        console.log(err);
		res.status(500).json(err);
	}
};
