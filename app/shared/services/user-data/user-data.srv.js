/*
 Created by bnaya on 25/01/16,
 @Component Name: customer.srv
 @Description: Manage all the user data in app.
 */
import currencyList from  '../../../../assets/jsons/currency.json'

export class UserData {
    constructor($http, localStorageService, $q, originService, $location, requestHandlerService, $rootScope, apiSocketService, bonusService, $state,popupsService) {
        'ngInject';
        this.$rootScope = $rootScope;
        this.localStorageService = localStorageService;
        this.$state = $state;
        this.$http = $http;
        this.$q = $q;
        this.userData = {
            resetPassword: {},
            promo: {amount: 0, bonus: 0}
        };
        this.$location = $location;
        this.requestHandlerService = requestHandlerService;
        this.server = originService.apiUrl;
        this.apiSocketService = apiSocketService;
        this.bonusService = bonusService;
        this.popupsService = popupsService;
        this.init();
    }

    /**
     * @init(async)
     * Initial function on startup the service.
     * @result - {promise} initial user details.
     */
    init() {
        if(!_.isUndefined(this.$location.$$search.whoami)) {
            this.localStorageService.set('whoami', this.$location.$$search.whoami);
        }
        if(!_.isUndefined(this.$location.$$search['utm_source'])) {
            this.localStorageService.set(`utm_source`, this.$location.$$search['utm_source']);
            if(!_.isUndefined(this.$location.$$search['navigate'])) {
                this.localStorageService.set(`navigate`, this.$location.$$search['navigate']);
            }
        }
        this.userData.loginTried = false; // init login try to false.
        this.userData.isUserLogin = false; // init user login to false.
        this.getDefaultCurrency();
        this.userGeoData().then((response)=> {
            this.userData.geoData = response.data; // Save geo data to user data.
            //this.isUserCountryBlocked();
        });
        //this.userDevice();
    }

    // Getters:

    /**
     * @getPersonalUserData(async)
     * Request personal user details.
     * @return - {promise} server response.
     */
    // TODO: Handle errors
    getPersonalUserData() {
        return this.$http.post(this.server + '/api/layer/read_personal_details', {async: true});
    }

    /**
     * @getDefaultCurrency(async)
     * Request user default currency.
     * @return - {promise} server response or default currency.
     */
    // TODO: Handle errors
    getDefaultCurrency() {
        if (typeof this.userData.defaultCurrency === 'undefined') { // Check if we already got default currency.
            return this.$http.post(this.server + '/api/layer/get_default_currency', {async: true}).then((response)=> {
                if (response.data.success) {
                    this.userData.defaultCurrency = response.data.message; // Save currency to user data.
                    return this.userData.defaultCurrency; // Return the default currency.
                } else {
                    return this.$q.reject(response.data); // return reject of the server response.
                }
            });
        } else {
            return this.$q.when(this.userData.defaultCurrency); // Return the default currency.
        }
    }

    /**
     * @userGeoData(async)
     * Request user geo data.
     * @return - {promise} server response or geo data.
     */
    // TODO: Handle errors
    userGeoData() {
        return this.$http.post(this.server + '/api/layer/getGeo_location_and_currency', {async: true});
    }

    getUserGeoData() {
        if(!_.isUndefined(this.userData.geoData)) {
            return this.$q.when(this.userData.geoData);
        } else {
            return this.userGeoData().then((response)=> {
                this.userData.geoData = response.data; // Save geo data to user data.
                return this.userData.geoData;
            });
        }
    }

    /**
     * @isUserCountryBlocked(async)
     * Check if user from blocked country.
     * @return - {promise} server response or block country info.
     */
    // TODO: Handle errors
    isUserCountryBlocked() {
        let params = {};
        if (typeof this.userData.countryBlockStatus === 'undefined') {
            if(typeof this.localStorageService.get('whoami') !== 'undefined') {
                params.whoami = this.localStorageService.get('whoami');                
            }
            return this.$http.post(this.server + '/api/layer/verification_blocked_country', params, {
                async: true,
                cache: false
            }).then((response) => {
                this.userData.countryBlockStatus = response.data.blocked_status;
                return response.data.blocked_status;
            });
        } else {
            return this.$q.when(this.userData.countryBlockStatus);
        }
    }

    // NOTE: legacy function, there is no definition on the new PRD or any need.
    //getCurrencyMinimum() {
    //    let params = {
    //        campaignId: this.userData.userSession.campaignId,
    //        currency: this.userData.userSession.currency
    //    };
    
    //    return this.$http.post(this.server + '/api/layer/currency_minimum', params, {async: true});
    //}

    // Setters:

    /**
     * @userIsLogin(async)
     * Handle response user session.
     * @purpose - Handle user session on logging.
     */
    // TODO: collect logic that belong to here from other functions (e.g: set session to local-storage)
    userIsLogin(session) {
        this.userData.loginTried = true; // Mark true login try.
        this.userData.isUserLogin = true; // Mark true user log in.
        this.userData.userSession = session; // Save response session to user data.
        this.userData.userSessionId = session.session_id;
        this.userData.promo = {amount: 0, bonus: 0};
        this.apiSocketService.createNewSocket(session.id);
        this.bonusService.setUserConfig(session.id, session.currency);
        const navigate = this.localStorageService.get(`navigate`);
        if(!_.isNull(navigate)) {
            this.$state.go(navigate);
        }


        // NOTE: legacy functions, there is no definitions on the new PRD.
        
        //this.getPersonalUserData().then((res) => { console.log('res', res)});
        
        //this.getFinancialUserData();
        //this.getCurrencyMinimum();
        
    }

    /**
     * @updatePersonalUserData(async)
     * Update user personal data.
     * @param {object} formData - full form data.
     * @return - {promise} server response.
     */
    // TODO: Handle errors
    updatePersonalUserData(params) {
        return this.requestHandlerService.requesting(`${this.server}/api/layer/update_personal_details`, params);
    }

    /**
     * @userIsLoggingOut
     * Handle user logging out.
     * @result - clear session on client.
     */
    userIsLoggingOut() {
        this.apiSocketService.closeSocket();
        for (var prop in this.userData)
            delete this.userData[prop]; // run over all properties of user data and delete them.
        this.init();
    }

    /**
     * @updatePassword(async)
     * Update user password.
     * @param {string} newPassword - user new password.
     * @return - {promise} server response.
     */
    // TODO: Handle errors
    updatePassword(params) {
        return this.requestHandlerService.requesting(`${this.server}/api/layer/forgot_password`, params);
    }

    /**
     * @setApproveTradeRisk(async)
     * Update user trade risk terms.
     * @return - {promise} server response.
     */
    // TODO: Handle errors
    setApproveTradeRisk() {
        return this.$http.post(`${this.server}/api/layer/update_trade_risk`, {async: true}).then((res) => {
            if (res.data.success) // check if trade risk request succeed.
                return res.data;
            else
                return this.$q.reject(res.data);
        });
    }

    /**
     * updateAccountBalance
     * @description: get the most updated account balance from an API call the takes it from spot option.
     * @returns {Promise.<TResult>|*}
     */
    updateAccountBalance() {
        let params = {
            id: this.userData.userSession.id
        };
        return this.$http.post(this.server + '/api/layer/readBalance', params, {async: true}).then((response)=> {
            if (response.data) { // Check if user is log in.
                this.userData.userSession.accountBalance = response.data.balance;
            } else {
                // TODO: handle errors
            }
        });
    }

    /**
     * updateSession
     * @description: update the data of the current user session after with the most updated data.
     * @returns {Promise.<TResult>|*}
     */
    updateSession() {
        return this.$http.get(this.server + '/api/layer/read', {async: true}).then((response)=> {
            if(response.data.id) {
                this.userData.userSession = response.data;
            }
        });
    }

    reloadDataToSession() {        
        return this.$http.post(this.server + '/api/layer/reload_user_data_to_session', {async: true}).then(this.updateSession());
    }

    /**
     * requestPromotion
     * @description: Send request for promotion.
     * @returns {Promise.<TResult>|*}
     */
    requestPromotion() {
        this.loadingFrameService.startLoading();
        return this.$http.post(this.server + '/api/layer/requestPromotion', {async: true}).then((response)=> {
            if (response.data.success) {
                this.loadingFrameService.stopLoading();
                return response.data;
            } else {
                return this.$q.reject(response.data)
            }
        });
    }

    /**
     * sendDocumentation
     * @description: send documentation file to back.
     * @returns {Promise.<TResult>|*}
     */
    sendDocumentation(file) {
        return this.$http.post(this.server + '/api/layer/uploadDucuments', file, {async: true}).then((response)=> {
            return response;
        })
    }

    verifyAllDocumentUploadSuccessfuly(param) {
        // let params = {};
        return this.requestHandlerService.requesting(`${this.server}/api/layer/sendComplianceEmail`, param);
    }


    getOpenPositions() {
        return this.$http.post(this.server + '/api/layer/getOpenPositions', {async: true}).then((response)=> {
            return response.data.message;
        });
    }

    getPotentialProfit() {
        return this.$http.post(this.server + '/api/layer/getPotentialProfit', {async: true}).then((response)=> {
            return response.data.message;
        });
    }

    getAveragePositions() {
        return this.$http.post(this.server + '/api/layer/getAveragePositions', {async: true}).then((response)=> {
            return response.data.message;
        });
    }

    checkTotalDeposits() {
        return this.$http.post(this.server + '/api/layer/checkTotalDeposits', {async: true}).then((response)=> {
            return response.data.message;
        });
    }

    sendVipTrade(emailType) {
        let params = {
            type: emailType
        };
        return this.$http.post(this.server + '/api/layer/sendVipTrade', params, {async: true}).then((response)=> {
            return response.data;
        });
    }

    getWinsBarData() {
        return this.$http.post(this.server + '/api/layer/getWinsBarData', {async: true}).then((response)=> {
            return response.data.message;
        });
    }

    validatePromoCode(params) {
        let _that = this;
        let broadcastErrors = (response) => {
            // Locate the client currency object in the currency list

            let currency = _.find(currencyList, {"code": this.userData.userSession.currency});
            // If the currency was found in the list, take its symbol, otherwise take the currency initials defined by the user
            let symbol = currency ? currency.symbol : this.userData.userSession.currency;

            let genericValidateParams = {
                message: `Congratulations! You are eligible to a Bonus up to ${symbol}${response.data.message.max} according to a deposit amount ${symbol}${params.amount} subject to a min deposit of ${symbol}${response.data.message.min}`,
                isOptionalValid: true
            };
            this.$rootScope.$broadcast(`${this.userData.promo.field}GenericValid`, genericValidateParams);
        };

        return this.requestHandlerService.requesting(`${this.server}/api/layer/request_promo_code`, params, {timer: 5000, settemplate: 'custom'}, undefined, undefined, false).then((response) => {

            this.userData.promo.bonus = ((Number(params.amount) / 100) * Number(response.data.message.bonus));
            //params.field=((params.depositType==='3d' || params.depositType==='ftd') && typeof params.field==="undefined")?'promo':params.field;
            
            let broadCastParams = {
                promoBonus: this.userData.promo.bonus,
                success: true,
                field: params.field,
                agreement_popup: response.data.message.agreement_popup
            };

            if(Number(params.amount) < Number(response.data.message.min)) {
                broadcastErrors(response);
                broadCastParams.success = false;
            } else if(Number(params.amount) > Number(response.data.message.max)) {
                broadcastErrors(response);
                broadCastParams.success = false;
            } else {
                this.$rootScope.$broadcast(`${this.userData.promo.field}ClearGenericValid`, {});
            }
            
            
            let targetUpdate = "bonusUpdate" + broadCastParams.field;
            this.$rootScope.$broadcast(targetUpdate, broadCastParams);
            return response;
        }).catch((response) => {
             
            //params.field=((params.depositType==='3d' || params.depositType==='ftd') && typeof params.field==="undefined")?'promo':params.field;
            let broadCastParams = {
                success: false,
                field: params.field
            };
            this.$rootScope.$broadcast(`${this.userData.promo.field}ClearGenericValid`, {});


            
            let targetUpdate = "bonusUpdate" + broadCastParams.field;
            this.$rootScope.$broadcast(targetUpdate, broadCastParams);            
            return this.$q.reject(response);
        });
    }

    requestPromotion(params) {
        return this.requestHandlerService.requesting(`${this.server}/api/layer/send_internal_promotion_request_email`, params);
    }
}
