'use strict';

angular.module('tempoApp')
  .constant('calendarConfig', {})
  .directive('calendar', [function() {
    return {
      link: function (scope) {
        scope.getOutDaysOfFirstWeekOfMonth = function (inputDate) {
          var date = new Date(inputDate.getTime());
          date.setDate(1);
          var numberOfDays = date.getDay() - 1;

          date.setDate(date.getDate() - 1);
          var lastDayOfPreviousMonth = date.getDate();

          var days = [];
          for (var i = 0; i < numberOfDays; i++) {
            days.push(lastDayOfPreviousMonth);
            lastDayOfPreviousMonth = lastDayOfPreviousMonth - 1;
          }

          return days;
        };

        scope.getWeekNumber = function (d) {
          // Copy date so don't modify original
          d = new Date(+d);
          d.setHours(0,0,0);
          // Set to nearest Thursday: current date + 4 - current day number
          // Make Sunday's day number 7
          d.setDate(d.getDate() + 4 - (d.getDay()||7));
          // Get first day of year
          var yearStart = new Date(d.getFullYear(),0,1);
          // Calculate full weeks to nearest Thursday
          var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
          // Return array of year and week number
          return weekNo;
        }

        scope.numberOfWeekInMonth = function (d) {

          var month = d.getMonth()
            , year = d.getFullYear()
            , firstWeekday = new Date(year, month, 1).getDay()
            , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
            , offsetDate = d.getDate() + firstWeekday - 1
            , index = 1 // start index at 0 or 1, your choice
            , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
            , week = index + Math.floor(offsetDate / 7)
          ;
          if (exact || week < 2 + index) return week;
          numberOfWeek = week === weeksInMonth ? index + 5 : week;

console.log(numberOfWeek);
          var weekNumber = scope.getWeekNumber(d);

          var weeks = [];
          for (var i = 0; i < numberOfWeek; i++) {
            weeks.push(weekNumber);
            weekNumber++;
          }

          return weeks;
        }
      },
      restrict: 'E',
      scope: {
        date: '=date',
        eventSources:'=ngModel'
      },
      templateUrl: '/js/directives/calendar.html',
      transclude: true
    };
  }]);
