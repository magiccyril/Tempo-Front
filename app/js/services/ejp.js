'use strict';

/**
 * @ngdoc service
 * @name tempoApp.tempo
 * @description
 * # tempo
 * Factory in the tempoApp.
 */
angular.module('tempoApp')
  .constant('EJP_API_URL', '')
  .constant('EJP_API_FROM_MONTH', 9)
  .constant('EJP_API_FROM_DAY', 1)
  .factory('EJP', ['$http', '$q', 'EJP_API_URL', 'EJP_API_FROM_MONTH', 'EJP_API_FROM_DAY'
  function($http, $q, EJP_API_URL, EJP_API_FROM_MONTH, EJP_API_FROM_DAY) {
    var getCounter = function () {
      var fromDate = moment();
      fromDate.month(EJP_API_FROM_MONTH - 1);
      fromDate.date(EJP_API_FROM_DAY);

      return $http.get(EJP_API_URL + '/ejp/count/' + fromDate.format('YYYY-MM-DD'));
    };

    var getZoneMonth = function (zone, date) {
      return $http.get(EJP_API_URL + '/ejp/' + date.format('YYYY-MM'))
        .then(function (response) {
          var data = response.data;

          var formatedData = {};
          for (var i = 0; i < data.length; i++) {
            var day = data[i];
            var dayDate = moment(day.date.year + '-' + day.date.month + '-' + day.date.day, 'YYYY-M-D');
            formatedData[dayDate.format('YYYY-MM-DD')] = day.zones[zone];
          }

          return formatedData;
        });
    };

    return {
      'getCounter': getCounter,
      'getMonth': getZoneMonth
    };
  }
]);
