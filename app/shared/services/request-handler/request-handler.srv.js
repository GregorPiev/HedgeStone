export class RequestHandler {
    // this service is in charge of delivering different types of content to the app
    // such as articles, guides, videos and pages.


    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor($rootScope, $q, popupsService, loadingFrameService, $http) {
        'ngInject';
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.popupsService = popupsService;
        this.loadingFrameService = loadingFrameService;
        this.$http = $http;        
    }

    /**
     * @init(async)
     * Initial function on startup the service.
     * @deprecated - no variables to initialize
     */
    init() {

    }

    /**
     * @makeRequest(async)
     * Handle the response of http requests.
     */
    requesting(apiEntry, params, popupSettings, method = 'post', options = {async: true}, withLoading = true) {        
        if (withLoading)
            this.loadingFrameService.startLoading();
        return this.$http[method](apiEntry, params, options)
            .then((response) => {
                
                return this.handleResponding(response, popupSettings).then((response) => {
                    
                    this.loadingFrameService.stopLoading();
                    return response;
                }).catch((response) => {
                    
                    this.loadingFrameService.stopLoading();
                    return this.$q.reject(response);
                });
            }, (response) => {
                
                return this.handleResponding(response, popupSettings).then((response) => {
                    this.loadingFrameService.stopLoading();
                    return response;
                }).catch((response) => {
                    this.loadingFrameService.stopLoading();
                    return this.$q.reject(response);
                });
            });
    }


    /**
     * @thenResponse(async)
     * Handle the response of http requests.
     */
    handleResponding(response, popupSettings) {
        
        if (_.isUndefined(response.data) || _.isNull(response.data) || response.status === 404) {
            // TODO: Change the text here.
            let techError = {
                data: {
                    errorType: 'popup',
                    error: {
                        'real_text': 'Unfortunately, for some reason the submitted action failed.<br />Please try again later.',
                        title: 'Technical Failure'
                    }
                }
            };
            this.handleError(techError, popupSettings);
            return this.$q.reject(response);
        }

        if (!_.isUndefined(response.data.success) && response.data.success) {
            
            return this.$q.resolve(response);
        } else {
            this.handleError(response, popupSettings);
            
            return this.$q.reject(response);
        }
    }

    handleError(response, popupSettings) {
        let data = response.data;
        if (data.errorType === "popup") {
            this.handlePopupError(data.error, popupSettings);
        } else if (data.errorType === "field") {
            this.handleFieldErrors(data.error);
        }
    }

    handlePopupError(error, popupSettings = {settemplate: 'custom'}) {
        this.popupsService.popItUp({
            type: 'popup',
            settemplate: popupSettings.settemplate,
            headline: error.title,
            content: error['real_text'],
            yes: popupSettings.yes,
            no: popupSettings.no,
            cancel: popupSettings.cancel
        }, popupSettings.importance, popupSettings.timer);
    }

    handleFieldErrors(errors, fieidIsOptional = false) {
        angular.forEach(errors, (value, key) => {
            switch (key) {
                case 'birthday':
                    key = 'Day'
            }
            let params = {
                message: value['real_text'],
                isOptionalValid: fieidIsOptional
            };
            this.$rootScope.$broadcast(`${key}GenericValid`, params);
        });
    }
}
