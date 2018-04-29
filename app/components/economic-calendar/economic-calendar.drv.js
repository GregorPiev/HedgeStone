/**
 * Created by saar on 04/09/16.
 */

import './economic-calendar.less';

export default angular.module('app.page.section.economic-calendar', [])
    .directive('economicCalendar', economicCalendarConfig);

function economicCalendarConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {

        },
        template: require('./economic-calendar.tpl.html'),
        controller: economicCalendarController,
        controllerAs: 'economicCalendar'
    }
}


class economicCalendarController {
    constructor($scope) {
        this.iframe = `<iframe src="https://sslecal2.forexprostools.com/?ecoDayBackground=%23141e29&defaultFont=%23a8a9ab&innerBorderColor=%2338404a&cssfile=https://www.hedgestonegroup.com/economic_calendar.css&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone,timeselector,filters&countries=29,25,54,145,34,174,163,32,70,6,27,37,122,15,113,107,55,24,121,59,89,72,71,22,17,51,39,93,106,14,48,33,23,10,35,92,57,94,97,68,96,103,111,42,109,188,7,105,172,21,43,20,60,87,44,193,125,45,53,38,170,100,56,80,52,36,90,112,110,11,26,162,9,12,46,85,41,202,63,123,61,143,4,5,138,178,84,75&calType=week&timeZone=55&lang=1" width="650" height="467" frameborder="0" allowtransparency="true" marginwidth="0" marginheight="0"></iframe>`
    }
}
