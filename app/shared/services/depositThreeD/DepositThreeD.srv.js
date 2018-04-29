export class DepositThreeD {
    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor(userService, $rootScope, $http, $q, $window, originService, loadingFrameService, requestHandlerService) {
        'ngInject';
        this.loading = false;
        this.paramString = "";
        this.userService = userService;
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.$q = $q;
        this.$window = $window;
        this.loadingFrameService = loadingFrameService;
        this.requestHandlerService = requestHandlerService;
        this.depositApiUrl = originService.depositApiUrl;
        this.depositApiUrlWallet = originService.depositApiUrlWallet;
        this.brand = originService.brand;
        this.referrer = originService.referrer;
        this.ecopayzUrl = '';
    }

    /**
     * @setParams
     * Prepare default data and form data for 3D deposit request.
     * @param {object} form - Deposit 3D form data.
     * @result - prepare all the params for get request.
     */
    setParams(form) {

        this.paramString = `currency=${this.userService.userData.userSession.currency}&id=${this.userService.userData.userSession.id}&referrer=${this.referrer}&brand=${this.brand}&processor_view=0`; // Config
        angular.forEach(form, (value, key) => {
            this.paramString += `&${key}=${value}`;
        });
        
    }

    /**
     * @setRequest(async)
     * Deposit 3D request.
     * @param {object} form - Deposit 3D form data.
     * @return - server response.
     */
    setRequest(form) {

        //this.setParams(form);
        //this.$rootScope.$broadcast('this.loading', this.loading);
        //let apiUrl = `${$location.$$protocol}://${$location.$$host}/layer/deposit?`;
        let apiUrl = `${this.depositApiUrl}/layer/deposit?`;

        //return this.requestHandlerService.requesting(`${apiUrl}${this.paramString}`, undefined, undefined, 'get').then((response) => this.processResponse(response));
        return this.requestHandlerService.requesting(`${this.depositApiUrl}/api/layer/deposit_credit_card`, form).then((response) => this.processResponse(response));
    }
    ;
            /**
             * @processResponse
             * Process server response.
             * @param {object} response - Deposit 3D server response.
             * @return - {object} server response.
             */
            processResponse(response) {

        switch (Number(response.data.processor_code)) { // Call the proper handler for every processor.
            case 1:
                {
                    //  fibonatix.
                    this.$rootScope.$broadcast('autoSubmit', response.data.redirect_form); // Fire the form in the response.data to autoSubmit component.
                }
                break;
            case 2:
                {
                    //  inatec.
                    // TODO: open the page in iframe.
                    //this.$window.location = response.data.redirect_url; // Redirect to Inatec page .
                    this.$rootScope.$broadcast('autoSubmit.redirect', response.data.redirect_url); // Fire the redirect url in the response.data to autoSubmit component.

                }
                break;
            case 3:
                {
                    //  solid ecp.
                    // TODO: open the page in iframe.
                    if (typeof response.data.redirect_url !== 'undefined') {
                        //this.$window.location = response.data.redirect_url; // Redirect to Ecp page.
                        this.$rootScope.$broadcast('autoSubmit.redirect', response.data.redirect_url); // Fire the redirect url in the response.data to autoSubmit component.
                    } else {
                        this.$rootScope.$broadcast('autoSubmit', response.data.redirect_form); // Fire the form in the response.data to autoSubmit component.
                    }
                }
                break;
            case 4:
                {
                    //  processing.
                    this.$rootScope.$broadcast('autoSubmit', response.data.redirect_form); // Fire the form in the response.data to autoSubmit component.
                }
                break;
            case 5:
                {
                    //  american volume.
                    this.$rootScope.$broadcast('autoSubmit', response.data.redirect_form); // Fire the form in the response.data to autoSubmit component.
                }
                break;
            case 6:
                {
                    //  solid borgan.
                    // TODO: open the page in iframe.
                    if (typeof response.data.redirect_url !== 'undefined') {
                        this.$rootScope.$broadcast('autoSubmit.redirect', response.data.redirect_url); // Fire the redirect url in the response.data to autoSubmit component.
                    } else {
                        this.$rootScope.$broadcast('autoSubmit', response.data.redirect_form); // Fire the form in the response.data to autoSubmit component.
                    }
                }
                break;
            case 7:
                {
                    //  processing.
                    this.$rootScope.$broadcast('autoSubmitForm', response.data.redirect_form); // Fire the form in the response.data to autoSubmit component.
                }
                break;
            case 8:
                {
                    //  processing.
                    this.$rootScope.$broadcast('autoSubmitURL', response.data.redirect_url, response.data.token, response.data.client_token, response.data.ttl); // Fire the form in the response.data to autoSubmit component.
                }
                break;
            default:
                let prm = response.data.success;
                
                this.$rootScope.$broadcast('exeDeposit', prm);
        }
        return response.data;
    }
    ;
            depositEcopayz(params) {
        params.brand = this.brand;
        
        return this.$http({
            url: `${this.depositApiUrlWallet}/layer/ecopayz_deposit`,
            method: 'GET',
            params: params
        }).then((response) => {
            this.ecopayzUrl = response.data.redirect_url;
            // this.$rootScope.$broadcast('autoSubmit.redirect', response.data.redirect_url); // Fire the redirect url in the response.data to autoSubmit component.
            return response;
            ;
        });
    }

    depositNeteller(params) {
        params.brand = this.brand;
        
        return this.$http({
            url: `${this.depositApiUrlWallet}/layer/neteller_deposit`,
            method: 'GET',
            params: params
        }).then((response) => {
            // this.$rootScope.$broadcast('autoSubmit.redirect', response.data.redirect_url); // Fire the redirect url in the response.data to autoSubmit component.
            return response;
        });
    }

    depositSkrill(params) {
        params.brand = this.brand;
        
        return this.$http({
            url: `${this.depositApiUrlWallet}/layer/skrill_deposit`,
            method: 'GET',
            params: params
        }).then((response) => {
            // this.$rootScope.$broadcast('autoSubmit.redirect', response.data.redirect_url); // Fire the redirect url in the response.data to autoSubmit component.
            return response;
        });
    }
}
