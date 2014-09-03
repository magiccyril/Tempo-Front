'use strict';

angular.module('tempoApp')
  .constant('calendarConfig', {})
  .directive('calendar', [function() {
    return {
      link: function (scope) {
        function getCalendar(inputMomentDate) {
          var calendarFirstDate = moment(inputMomentDate).startOf('month').startOf('week');
          var calendarLastDate = moment(inputMomentDate).endOf('month').endOf('week');

          var nbOfWeeks = Math.ceil((calendarLastDate.diff(calendarFirstDate, 'days') + 1) / 7);

          var date = calendarFirstDate.clone();

          var calendar = {};
          for (var i = 0; i < nbOfWeeks; i++) {
            calendar[i] = [];

            for (var j = 0; j < 7; j++) {
              var isGoodMonth = date.month() === inputMomentDate.month();
              var cssClass = 'empty';
              if (!isGoodMonth) {
                cssClass = 'out';
              }
              var data = '-';

              calendar[i].push({
                date: date,
                format: date.format('D'),
                isGoodMonth: isGoodMonth,
                data: data,
                cssClass: cssClass
              });
              date = date.add(1, 'days');
            }
          }

          return calendar;
        }

        scope.$watch('date', function() {
          scope.calendar = getCalendar(scope.date);
        });
      },
      restrict: 'E',
      scope: {
        date: '=date',
        events:'=ngModel'
      },
      templateUrl: '/js/directives/calendar.html',
      transclude: true
    };
  }]);
