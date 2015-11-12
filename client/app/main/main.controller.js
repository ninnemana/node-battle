'use strict';

angular.module('boomerApp')
    .controller('MainCtrl', function($scope, $http) {
        $scope.awesomeThings = [];
        $scope.endpoint1 = '';
        $scope.endpooint1Method = 'GET';
        $scope.endpoint2 = '';
        $scope.endpooint2Method = 'GET';

        $scope.battle = function() {
            var e1 = document.createElement('a');
            e1.href = $scope.endpoint1;
            var e2 = document.createElement('a');
            e2.href = $scope.endpoint2;

            var params1 = getQueryVariables(e1.search.substring(1));
            params1.push({
                key: 'limit',
                value: '10'
            });
            params1.push({
                key: 'iterations',
                value: '100'
            });

            var params2 = getQueryVariables(e2.search.substring(1));
            params2.push({
                key: 'limit',
                value: '10'
            });
            params2.push({
                key: 'iterations',
                value: '100'
            });

            var bench1 = {
                host: e1.host,
                protocol: e1.protocol || 'http:',
                path: e1.pathname,
                method: $scope.endpooint1Method,
                body: '',
                params: params1
            };
            var bench2 = {
                host: e2.host,
                protocol: e2.protocol || 'http:',
                path: e2.pathname,
                method: $scope.endpooint2Method,
                body: '',
                params: params2
            };

            $http({
                url: '/api/bench',
                method: 'post',
                data: bench1
            }).success(function(data) {
                $scope.response1 = data;
            });
            $http({
                url: '/api/bench',
                method: 'post',
                data: bench2
            }).success(function(data) {

                // var x = d3.scale.ordinal().rangeRoundBands([0, 1000], .05);
                // var y = d3.scale.linear().range([200, 0]);
                //
                // var xAxis = d3.svg.axis().scale(x).orient('bottom').tickValues(Object.keys(hist));
                // var yAxis = d3.svg.axis().scale(y).orient('left').ticks(d3.time.millisecond, 100);
                var svg = d3.select('.response2').attr('width', 1000).attr('height', 200).append('g');

                // A formatter for counts.
                var formatCount = d3.format(',.0f');

                var margin = {
                        top: 10,
                        right: 30,
                        bottom: 30,
                        left: 30
                    },
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x = d3.scale.linear()
                    .domain([0, 1])
                    .range([0, width]);

                // Generate a histogram using twenty uniformly-spaced bins.
                var data = d3.layout.histogram()
                    .bins(x.ticks(20))
                    (data);

                var y = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                        return d.y;
                    })])
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

                var svg = d3.select('.response2')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                var bar = svg.selectAll('.bar')
                    .data(data)
                    .enter().append('g')
                    .attr('class', 'bar')
                    .attr('transform', function(d) {
                        return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
                    });

                bar.append('rect')
                    .attr('x', 1)
                    .attr('width', x(data[0].dx) - 1)
                    .attr('height', function(d) {
                        return height - y(d.y);
                    });

                bar.append('text')
                    .attr('dy', '.75em')
                    .attr('y', 6)
                    .attr('x', x(data[0].dx) / 2)
                    .attr('text-anchor', 'middle')
                    .text(function(d) {
                        return formatCount(d.y);
                    });

                svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                // x.domain(recs.map(function (d) {
                // 	return d.increment;
                // }));
                // y.domain([0, d3.max(recs, function (d) {
                // 	return d.value;
                // })]);
                //
                // svg.append('g')
                // 	.attr('class', 'x axis')
                // 	.attr('transform', 'translate(0,1000)')
                // 	.call(xAxis)
                // 	.selectAll('text')
                // 	.style('text-anchor', 'end')
                // 	.attr('dx', '-.8em')
                // 	.attr('dy', '-.55em')
                // 	.attr('transform', 'rotate(-90)');
                //
                // svg.append('g')
                // 	.attr('class', 'y axis')
                // 	.call(yAxis)
                // 	.append('text')
                // 	.attr('transform', 'rotate(-90)')
                // 	.attr('y', 6)
                // 	.attr('dy', '.71em')
                // 	.style('text-anchor', 'end')
                // 	.text('Value ($)');
                //
                // svg.selectAll('bar')
                // 	.data(recs)
                // 	.enter().append('rect')
                // 	.style('fill', 'steelblue')
                // 	.attr('x', function (d) {
                // 		return x(d.increment);
                // 	})
                // 	.attr('width', x.rangeBand())
                // 	.attr('y', function (d) {
                // 		return y(d.value);
                // 	})
                // 	.attr('height', function (d) {
                // 		return 1000 - y(d.value);
                // 	});

                $scope.response2 = data;

                // var values = d3.range(1000).map(d3.random.bates(10));
                // var formatCount = d3.format(',.0f');
                //
                // var x = d3.scale.linear().domain([0, 1]).range([0, 1280]);
                //
                // console.log(x.ticks(20));
                // var data = d3.layout.histogram().bins(x.ticks(20));
                // console.log(data);
                // console.log(data(values));
                // console.log(data);
            });
        };

        function getQueryVariables(query) {
            // var query = window.location.search.substring(1);
            var vars = query.split('&');
            var pairs = [];
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                pairs.push({
                    key: decodeURIComponent(pair[0]),
                    value: decodeURIComponent(pair[1])
                });
            }
            return pairs;
        }


        $http.get('/api/things').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
        });

    });