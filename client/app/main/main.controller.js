'use strict';

angular.module('boomerApp')
  .controller('MainCtrl', function ($scope, $http) {
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
            params:params1
        };
        var bench2 = {
            host: e2.host,
            protocol: e2.protocol || 'http:',
            path: e2.pathname,
            method: $scope.endpooint2Method,
            body: '',
            params:params2
        };

        $http({
            url: '/api/bench',
            method: 'post',
            data: bench1
        }).success(function(data){
            $scope.response1 = data;
        });
        $http({
            url: '/api/bench',
            method: 'post',
            data: bench2
        }).success(function(data){
            $scope.response2 = data;
            // Generate a Bates distribution of 10 random variables.
            var values = d3.range(1000).map(d3.random.bates(10));
            // var values = d3.range(data.stats.totalElapsed).map(data.stats.main.histogram);
            // A formatter for counts.
            var formatCount = d3.format(',.0f');

            var x = d3.scale.linear().domain([0, 1]).range([0, 1280]);

            // Generate a histogram using twenty uniformly-spaced bins.
            console.log(x.ticks(20));
            var data = d3.layout.histogram().bins(x.ticks(20));
            console.log(data);
            console.log(data(values));
            console.log(data);
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
