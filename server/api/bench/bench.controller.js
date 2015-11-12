var _ = require('lodash');
var loadtest = require('loadtest');
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
        var iterations = 20;
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

		var results = [];
		var options = {
			url: endpoint,
			maxSeconds: 15,
			// concurrency: limit,
			// maxRequests: iterations,
			method: benchOptions.method,
			statusCallback: function(result){
				results = result;
			}
		};

		if (benchOptions.method === 'POST' && benchOptions.body) {
			options.body = benchOptions.body;
		}

		loadtest.loadTest(options, function(err) {
			if (err) {
				res.status(500).send(err);
			}else{
				res.status(200).send(results);
			}
		});
	} catch (err) {
		res.status(500).json(err);
	}
};
