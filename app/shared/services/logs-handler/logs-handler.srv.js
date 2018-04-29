export class LogsHandler {
    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor($http, originService, $window, $location) {
        'ngInject';
        this.$http = $http;
        this.$window = $window;
        this.$location = $location;
        this.originService = originService;
        this.server = originService.apiUrl;
        this.init();
        this.consoleTypeLog = 1;
        this.consoleTypeError = 2;
    }

    /**
     * @init(async)
     * Initial function on startup the service.
     * @result -
     */
    init() {
        if(!this.originService.isDevEnv() && Boolean(this.$location.$$search.debug) !== true)
            this.decorateLog();
    }

    decorateLog() {
        let originalFunc = console.log;
        let self = this;
        console.log = function() {
            let message = [].concat([].slice.call(arguments));
//            self.$http.post(self.server + '/api/layer/getConsoleLogToDB', {message: angular.toJson(message), "console_type": this.consoleTypeLog, origin: 1, "user_data": new Date()}, {async: true}).then((response) => {
//                originalFunc.apply(console, [`Site log id: ${response.data.id}`]);
//            }).catch((response) => {
//                originalFunc.apply(console, message);
//            });
        };

        console.error = function() {
            let message = [].concat([].slice.call(arguments));
//            self.$http.post(self.server + '/api/layer/getConsoleLogToDB', {message: angular.toJson(message), "console_type": this.consoleTypeError, origin: 1, "user_data": new Date()}, {async: true}).then((response) => {
//                originalFunc.apply(console, [`Site error id: ${response.data.id}`]);
//            }).catch((response) => {
//                originalFunc.apply(console, message);
//            });
        };
    }

}
