"use strict";moment.locale("fr",{months:"Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"une année",yy:"%d années"},ordinal:function(a){return a+(1===a?"er":"ème")},week:{dow:1,doy:4}}),angular.module("tempoApp",["ngSanitize","ngTouch"]),angular.module("tempoApp").constant("CONTACT_SUBJECT","Contact tempo.18ruedivona.eu").constant("CONTACT_SENDTO_EMAIL","tempo@18ruedivona.eu").constant("CONTACT_SENDTO_NAME","Tempo").constant("MANDRILL_APIKEY","vE7Jt7oEhNU4rJEa75HjIg"),angular.module("tempoApp").constant("CALENDAR_MIN_DATE","2004-09-01").controller("MainCtrl",["$scope","CALENDAR_MIN_DATE","Forecast","Tempo","EJP",function(a,b,c,d,e){a.isOffPeak=function(){return moment().hours()>=0&&moment().hours()<6||moment().hours()>22&&moment().hours()<=23},a.onCalendarTypeClick=function(){a.showCalendarType=!a.showCalendarType},a.onCalendarTypeChange=function(){a.showCalendarType=!1,a.calendarLoadData(),window.ga&&ga("send","event","calendar-type","change",a.calendarType,{nonInteraction:!0})},a.calendarTypeFormat=function(a){switch(a){case"tempo":return"Tempo";case"ejp-north":return"EJP Nord";case"ejp-paca":return"EJP PACA";case"ejp-west":return"EJP Ouest";case"ejp-south":return"EJP Sud"}},a.calendarLoadData=function(){switch(a.calendarType){case"tempo":d.getMonth(a.calendarDate).then(function(b){a.calendarEvents=b});break;case"ejp-north":e.getMonthByZone("north",a.calendarDate).then(function(b){a.calendarEvents=b});break;case"ejp-paca":e.getMonthByZone("paca",a.calendarDate).then(function(b){a.calendarEvents=b});break;case"ejp-west":e.getMonthByZone("west",a.calendarDate).then(function(b){a.calendarEvents=b});break;case"ejp-south":e.getMonthByZone("south",a.calendarDate).then(function(b){a.calendarEvents=b})}},a.changeMonth=function(c){var d=!c.isBefore(b);d&&(a.calendarDate=c,a.previousMonth=moment(c).subtract(1,"month"),a.nextMonth=moment(c).add(1,"month"),a.previousYear=moment(c).subtract(1,"year"),a.nextYear=moment(c).add(1,"year"),a.today=moment(),a.calendarLoadData(),window.ga&&ga("send","event","calendar-date","change",c.format("YYYY/MM/DD"),{nonInteraction:!0}))},a.showCalendarType=!1,a.calendarType="tempo",a.changeMonth(moment()),a.calendarEvents=[],a.todayDate=moment(),a.tomorrowDate=moment().add(1,"days"),moment().hours>0&&moment.hours<6&&(a.todayDate.subtract(1,"days"),a.tomorrowDate.subtract(1,"days")),d.getCounter().then(function(b){a.tempoCounter=b}),e.getCounter().then(function(b){a.ejpCounter=b}),c.fetch().then(function(b){a.forecast=b})}]),angular.module("tempoApp").controller("ContactCtrl",["$scope","Mandrill","CONTACT_SUBJECT","CONTACT_SENDTO_EMAIL","CONTACT_SENDTO_NAME",function(a,b,c,d,e){a.contactStatus={connected:!1,error:void 0,pending:!1,sent:!1},b.ping().then(function(){a.contactStatus.connected=!0},function(){a.contactStatus.connected=!1}),a.name="",a.email="",a.message="",a.onContactFormSubmit=function(){var f={subject:c,text:a.message,from_email:a.email,from_name:a.name,to:[{email:d,name:e,type:"to"}]};a.contactStatus.pending=!0,b.sendMessage(f).then(function(){a.contactStatus.pending=!1,a.contactStatus.sent=!0},function(){a.contactStatus.pending=!1,a.contactStatus.error=!0}),window.ga&&ga("send","event","contact","send",a.email,{nonInteraction:!0})},a.resetForm=function(){a.contactStatus.sent=!1,a.message=""}}]),angular.module("tempoApp").directive("calendar",[function(){return{link:function(a){function b(b){for(var c=moment(b).startOf("month").startOf("week"),d=moment(b).endOf("month").endOf("week"),e=Math.ceil((d.diff(c,"days")+1)/7),f=c.clone(),g={},h=0;e>h;h++){g[h]=[];for(var i=0;7>i;i++){var j="-",k=f.month()===b.month(),l="empty";k||(l="out"),a.events[f.format("YYYY-MM-DD")]&&(l=a.events[f.format("YYYY-MM-DD")].raw,j=a.events[f.format("YYYY-MM-DD")].formated),g[h].push({date:f,format:f.format("D"),isGoodMonth:k,data:j,cssClass:l}),f=f.add(1,"days")}}return g}a.$watch("date",function(){a.calendar=b(a.date)}),a.$watch("events",function(){a.calendar=b(a.date)})},restrict:"E",scope:{date:"=date",events:"=ngModel"},templateUrl:"views/directives/calendar.html"}}]),angular.module("tempoApp").directive("ejpForecastItem",[function(){return{link:function(a,b){var c=function(){b.attr({"class":"",title:"Jour non déterminé"}),a.model&&!0===a.model.raw&&b.attr({"class":"forecast-ejp-item-ejp",title:"Jour EJP"}),a.model&&!1===a.model.raw&&b.attr({"class":"forecast-ejp-item-not",title:"Jour non EJP"})};a.$watch("model",c)},restrict:"A",scope:{model:"=ngModel"},templateUrl:"views/directives/ejpForecastItem.html",transclude:!0}}]),angular.module("tempoApp").constant("MANDRILL_API_URL","https://mandrillapp.com/api/1.0/").factory("Mandrill",["$http","$q","MANDRILL_APIKEY","MANDRILL_API_URL",function(a,b,c,d){var e=function(){return a({method:"POST",url:d+"/users/ping2.json",params:{key:c}})},f=function(e){return a.post(d+"/messages/send.json",{key:c,message:e}).then(function(a){var c=a.data,d=0,e=!0;for(0===c.length&&(e=!1);e&&d<c.length;)("rejected"===c[d].status||"invalid"===c[d].status)&&(e=!1),d++;return e?!0:b.reject()})};return{ping:e,sendMessage:f}}]),angular.module("tempoApp").constant("TEMPO_API_URL","http://api.tempo.18ruedivona.eu/tempo/").constant("TEMPO_API_FROM_MONTH",9).constant("TEMPO_API_FROM_DAY",1).constant("TEMPO_API_COUNT_BLUE",300).constant("TEMPO_API_COUNT_WHITE",43).constant("TEMPO_API_COUNT_RED",22).factory("Tempo",["$http","$q","TEMPO_API_URL","TEMPO_API_FROM_MONTH","TEMPO_API_FROM_DAY","TEMPO_API_COUNT_BLUE","TEMPO_API_COUNT_WHITE","TEMPO_API_COUNT_RED",function(a,b,c,d,e,f,g,h){var i={},j=function(a){switch(a){case"blue":return"Bleu";case"white":return"Blanc";case"red":return"Rouge"}},k=function(){var a=moment();return a.month(d-1),a.date(e),a.subtract(1,"year"),moment().month()+1>=d&&a.add(1,"year"),a},l=function(){var b=k();return moment().isLeapYear()&&(f+=1),a.get(c+"count/"+b.format("YYYY-MM-DD")+"?"+moment().unix()).then(function(a){return{blue:f-a.data.blue,white:g-a.data.white,red:h-a.data.red}})},m=function(a){var b={};return angular.forEach(a,function(a){var c=moment(a.date.year+"-"+a.date.month+"-"+a.date.day,"YYYY-M-D");b[c.format("YYYY-MM-DD")]={raw:a.color,formated:j(a.color)}}),b},n=function(d,e){if(angular.isUndefined(e)&&(e=!1),i[d]&&!e){var f=b.defer();return f.resolve(i[d]),f.promise}return a.get(c+d+"?"+moment().unix()).then(function(a){return i[d]=m(a.data),i[d]})},o=function(d,e,f){if(moment.isMoment(e)||(e=moment(e)),!e.isValid())return b.reject("Invalid date");if("blue"!==f&&"white"!==f&&"red"!==f)return b.reject("Invalid color");var g={year:e.format("YYYY"),month:e.format("M"),day:e.format("D"),color:f};return a.post(c+"?apikey="+d,g)},p=function(d,e){return moment.isMoment(e)||(e=moment(e)),e.isValid()?a.delete(c+e.format("YYYY-MM-DD")+"?apikey="+d):b.reject("Invalid date")};return{formatColor:j,getStartDate:k,getCounter:l,getMonth:function(a,b){return n(a.format("YYYY-MM"),b)},getYear:function(a,b){return n(a.format("YYYY"),b)},save:o,"delete":p}}]),angular.module("tempoApp").constant("EJP_API_URL","http://api.tempo.18ruedivona.eu/ejp/").constant("EJP_API_FROM_MONTH",10).constant("EJP_API_FROM_DAY",1).constant("EJP_API_COUNT",22).factory("EJP",["$http","$q","EJP_API_URL","EJP_API_FROM_MONTH","EJP_API_FROM_DAY","EJP_API_COUNT",function(a,b,c,d,e,f){var g={},h={},i=function(){var a=moment();return a.month(d-1),a.date(e),a.subtract(1,"year"),moment().month()+1>=d&&a.add(1,"year"),a},j=function(){var b=i();return a.get(c+"count/"+b.format("YYYY-MM-DD")).then(function(a){return{north:f-a.data.north,paca:f-a.data.paca,west:f-a.data.west,south:f-a.data.south}})},k=function(a){return a?"EJP":"Non EJP"},l=function(a){for(var b=a.data,c={},d=0;d<b.length;d++){var e=b[d],f=moment(e.date.year+"-"+e.date.month+"-"+e.date.day,"YYYY-M-D");for(var g in e.zones)c[g]||(c[g]={}),c[g][f.format("YYYY-MM-DD")]={raw:e.zones[g]?"red":"white",formated:k(e.zones[g])}}return c},m=function(a){for(var b=a.data,c={},d=0;d<b.length;d++){var e=b[d],f=moment(e.date.year+"-"+e.date.month+"-"+e.date.day,"YYYY-M-D"),g=f.format("YYYY-MM-DD");c[g]||(c[g]={});for(var h in e.zones)c[g][h]||(c[g][h]={}),c[g][h]={raw:e.zones[h],formated:k(e.zones[h])}}return c},n=function(d,e,f){if(angular.isUndefined(f)&&(f=!1),g[e]&&g[e][d]&&!f){var h=b.defer();return h.resolve(g[e][d]),h.promise}return a.get(c+e).then(function(a){return g[e]=l(a),g[e][d]})},o=function(d,e){if(angular.isUndefined(e)&&(e=!1),h[d]&&!e){var f=b.defer();return f.resolve(h[d]),f.promise}return a.get(c+d).then(function(a){return h[d]=m(a),h[d]})},p=function(d,e,f){if(!e.isValid())return b.reject("Invalid date");var g="object"==typeof f&&"boolean"==typeof f.north&&"boolean"==typeof f.paca&&"boolean"==typeof f.west&&"boolean"==typeof f.south;if(!g)return b.reject("Invalid zones");var h={year:e.format("YYYY"),month:e.format("M"),day:e.format("D"),zones:f};return a.post(c+"?apikey="+d,h)},q=function(d,e){return moment.isMoment(e)||(e=moment(e)),e.isValid()?a.delete(c+e.format("YYYY-MM-DD")+"?apikey="+d):b.reject("Invalid date")};return{getStartDate:i,getCounter:j,getMonthByZone:function(a,b,c){return n(a,b.format("YYYY-MM"),c)},getYearByZone:function(a,b,c){return n(a,b.format("YYYY"),c)},getMonthByDate:function(a,b){return o(a.format("YYYY-MM"),b)},getYearByDate:function(a,b){return o(a.format("YYYY"),b)},save:p,"delete":q}}]),angular.module("tempoApp").constant("FORECAST_API_URL","http://api.tempo.18ruedivona.eu").factory("Forecast",["$http","$q","FORECAST_API_URL",function(a,b,c){var d=function(a){switch(a){case"blue":return"Bleu";case"white":return"Blanc";case"red":return"Rouge"}},e=function(){return a.get(c+"/forecast").then(function(a){var b=a.data,c={today:{tempo:null,ejp:{north:null,paca:null,west:null,south:null}},tomorrow:{tempo:null,ejp:{north:null,paca:null,west:null,south:null}}};return b.today&&b.today.tempo&&(c.today.tempo={raw:b.today.tempo.color,format:d(b.today.tempo.color)}),b.today&&b.today.ejp&&(c.today.ejp.north={raw:b.today.ejp.zones.north,format:b.today.ejp.zones.north?"EJP":"non EJP"},c.today.ejp.paca={raw:b.today.ejp.zones.paca,format:b.today.ejp.zones.paca?"EJP":"non EJP"},c.today.ejp.west={raw:b.today.ejp.zones.west,format:b.today.ejp.zones.west?"EJP":"non EJP"},c.today.ejp.south={raw:b.today.ejp.zones.south,format:b.today.ejp.zones.south?"EJP":"non EJP"}),b.tomorrow&&b.tomorrow.tempo&&(c.tomorrow.tempo={raw:b.tomorrow.tempo.color,format:d(b.tomorrow.tempo.color)}),b.tomorrow&&b.tomorrow.ejp&&(c.tomorrow.ejp.north={raw:b.tomorrow.ejp.zones.north,format:b.tomorrow.ejp.zones.north?"EJP":"non EJP"},c.tomorrow.ejp.paca={raw:b.tomorrow.ejp.zones.paca,format:b.tomorrow.ejp.zones.paca?"EJP":"non EJP"},c.tomorrow.ejp.west={raw:b.tomorrow.ejp.zones.west,format:b.tomorrow.ejp.zones.west?"EJP":"non EJP"},c.tomorrow.ejp.south={raw:b.tomorrow.ejp.zones.south,format:b.tomorrow.ejp.zones.south?"EJP":"non EJP"}),c})};return{fetch:e}}]);