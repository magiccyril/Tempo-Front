'use strict';

angular.module('tempoApp')
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
              var data = '-';

              var isGoodMonth = date.month() === inputMomentDate.month();
              var cssClass = 'empty';
              if (!isGoodMonth) {
                cssClass = 'out';
              }

              if (scope.events[date.format('YYYY-MM-DD')]) {
                cssClass = scope.events[date.format('YYYY-MM-DD')].raw;
                data     = scope.events[date.format('YYYY-MM-DD')].formated;
              }

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

        scope.$watch('events', function() {
          scope.calendar = getCalendar(scope.date);
        });
      },
      restrict: 'E',
      scope: {
        date: '=date',
        events:'=ngModel'
      },
      templateUrl: 'views/directives/calendar.html'
    };
  }]);
