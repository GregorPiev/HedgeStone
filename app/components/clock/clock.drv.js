/**
 * Created by saar on 6/6/16.
 * @Description: The clock component
 */

import './clock.less';
import 'angular-clock';

export default angular.module('app.page.clock', ['ds.clock'])
    .directive('clock', clockConfig);

function clockConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./clock.tpl.html'),
        controller: clockController,
        controllerAs: 'clock'
    }
}

class clockController {
    constructor() {
        let d = new Date();
        this.gmt = d.getTimezoneOffset() / 60;
        if(this.gmt < 0)
            this.gmtSign = `+`;
        else
            this.gmtSign = `-`;
        this.gmt = this.gmt * -1;
        //this.gmt = d.getTimezoneOffset();
        this.date = `EEEE, MMMM dd yyyy`; // date format
        this.time = `hh:mm:ss a`; // time format
    }
}