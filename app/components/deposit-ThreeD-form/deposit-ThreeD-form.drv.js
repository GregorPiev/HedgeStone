/*
 Created by bnaya on 28/01/16,
 @Component Name: page.drv
 @Description:
 @Params:
 @Return:
 @Methods:
 */

import './deposit-ThreeD-form.less';

export default angular.module('app.page.section.depositThreeDForm', [])
        .directive('depositThreeDForm', depositThreeDFormConfig);

function depositThreeDFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./deposit-ThreeD-form.tpl.html'),
        controller: depositThreeDFormController,
        controllerAs: 'depositThreeDForm'
    }
}

class depositThreeDFormController {
    /**
     * @constructor
     * construct function, define variables and initial form data.
     * @purpose - define variables and initial class.
     */
    constructor($rootScope, $scope, depositThreeDService, popupsService, $window, $timeout, userService, domFactory, loadingFrameService, originService, localStorageService, countriesService, $state, $cookies, requestHandlerService, $location) {
        this.depositThreeDFormData = $scope.data;
        this.depositThreeDService = depositThreeDService;
        this.$window = $window;
        this.$scope = $scope;
        this.localStorageService = localStorageService;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.$state = $state;
        this.popupsService = popupsService;
        this.userService = userService;
        this.loadingFrameService = loadingFrameService;
        this.originService = originService;
        this.countriesService = countriesService;
        this.localStorageService = localStorageService;
        this.countriesService = countriesService;
        this.$cookies = $cookies;
        this.$location = $location;
        this.domain = ($location.$$host === 'localhost') ? "" : ".hedgestonegroup.com";
        $scope.agreement_popup = false;
        this.prelimenaryTestBonus = false;
        this.formDataSend = '';
        this.requestHandlerService = requestHandlerService;
        this.referrer = originService.referrer;
        this.brand = originService.brand;

        this.html = "";
        this.html = domFactory.generateArray(this.depositThreeDFormData, 'depositThreeDForm', 'depositThreeDFormData');
        this.checkMinimumAmount();
        this.autoFillFileds();
        this.submitting();
        let _this = this;        
        $timeout(() => { 
        
            let promo_bonus = (this.localStorageService.get('PromoCode')) ? this.localStorageService.get('PromoCode') : ((this.$cookies.get('promo_bonus')) ? this.$cookies.get('promo_bonus') : false);
            
            if (promo_bonus) {                
                let depositAmount = $('input[name="amount"]').val();                
                let  dirElementInput='input[name="promo"]';
                angular.element(dirElementInput).val(promo_bonus).trigger('input');
                
                let params = {
                    field: "promo",
                    amount: depositAmount,
                    promo: promo_bonus,
                    id: _this.userService.userData.userSession.id,
                    depositType: _this.userService.userData.userSession.ftd ? '3d' : 'ftd'
                };
                let resultValidate = _this.userService.validatePromoCode(params);
            }        
        
       }, 250);
        

        this.$scope.$on('bonusUpdatepromo', (e, param) => {            
            if (param.success) {
                param.field = "promo";

                if (param.agreement_popup != 0) {                    
                    _this.popupsService.popItUp({
                        type: 'popup',
                        settemplate: 'confirm',
                        headline: 'Bonus Option',
                        content: `In order to receive your bonus please agree with <a href='https://www.hedgestonegroup.com/assets/legal/Hedgestone_bonus_policy.pdf' target='_blank'>bonusT&C</a>.<br>With pressing Disagree You will not be entitled to receive to the Bonus`,
                        yesbtntitle: 'I agree',
                        nobtntitle: 'Disagree',
                        yes: function () {
                            $scope.agreement_popup = true;
                            _this.popupsService.popItDown();
                            _this.$scope.$broadcast('bonusUpdatePromo', param);
                            _this.prelimenaryTestBonus = true;
                            if (_this.formDataSend != '') {
                                _this.submit(_this.formDataSend);
                            }
                        },
                        no: function () {
                            _this.prelimenaryTestBonus = true;
                            _this.popupsService.popItDown();
                            _this.$scope.$broadcast('bonusUpdatePromo', param);
                            if (_this.formDataSend != '') {
                                _this.submit(_this.formDataSend);
                            }
                        }
                    });
                } else {                   
                    _this.popupsService.popItUp({
                        type: 'popup',
                        settemplate: 'confirmno',
                        yes: function () {
                            _this.prelimenaryTestBonus = true;
                            _this.popupsService.popItDown();
                            _this.$scope.$broadcast('bonusUpdatePromo', param);
                            if (_this.formDataSend != '') {
                                _this.submit(_this.formDataSend);
                            }
                        }
                    });
                }

            } else {
                _this.prelimenaryTestBonus = true;
                if (_this.formDataSend != '') {
                    _this.submit(_this.formDataSend);
                }
            }
        });
        $scope.$on('tabBtn', (event, data) => {
            if (data.title === 'Card') {  
                let promo_bonus = (this.localStorageService.get('PromoCode')) ? this.localStorageService.get('PromoCode') : ((this.$cookies.get('promo_bonus')) ? this.$cookies.get('promo_bonus') : false);
               if (promo_bonus) { 
                     let depositAmount = $('input[name="amount"]').val();                
                     let  dirElementInput='input[name="promo"]';
                     angular.element(dirElementInput).val(promo_bonus).trigger('input');
                     let params = {
                        field: "promo",
                        amount: depositAmount,
                        promo: promo_bonus,
                        id: _this.userService.userData.userSession.id,
                        depositType: _this.userService.userData.userSession.ftd ? '3d' : 'ftd'
                    };
                    let resultValidate = _this.userService.validatePromoCode(params);                     
               }
               
               
                if (!this.$cookies.get('promo_bonus')) {
                    this.$scope.$broadcast('bonusClose', "Promo");
                }
            }
        });
        $scope.$on('exeDeposit', (event, params) => {            
            this.exeDeposit(params);
        });

    }

    checkMinimumAmount() {
        let currency = this.userService.userData.userSession.currency;
        if (currency === 'AUD' || currency === 'CAD') {
            let inputs = _.findKeyInObj(this.depositThreeDFormData, 'msgBox');
            let amountInput = _.find(inputs, {attrs: {name: 'amount'}});
            amountInput.dynamicAttrs['ng-model'] = 350;
            amountInput.attrs.min = 350;
            amountInput.msgBox.min = `The minimum deposit amount stands on 350.`;
        } else
            return;
    }

    autoFillFileds() {
        let fields = _.findKeyInObj(this.depositThreeDFormData, "element");
        // Define data from session to form fields.
        angular.forEach(fields, (value, key) => {
            // value.dynamicAttrs['ng-model'] = _.find(value, {name: "first_name"}) ? this.userService.userData.userSession.FirstName :
            //     _.find(value, {name: "last_name"}) ? this.userService.userData.userSession.LastName :
            //     _.find(value, {name: "City"}) ? this.userService.userData.userSession.City :
            //     _.find(value, {name: "address"}) ? this.userService.userData.userSession.street :
            //     _.find(value, {name: "postal"}) ? this.userService.userData.userSession.postCode :
            //     _.find(value, {name: "phone"}) ? this.userService.userData.userSession.phoneView :
            //     (_.find(value, {name: "promo"}) && !_.isNull(this.localStorageService.get('promoCode')) && !_.isUndefined(this.localStorageService.get('promoCode'))) ? this.localStorageService.get('promoCode') :
            //     (_.find(value, {name: "amount"}) && !_.isNull(this.localStorageService.get('amount')) && !_.isUndefined(this.localStorageService.get('amount'))) ? this.localStorageService.get('amount') : "";
            
            if (value.element === 'input') {
                if (_.find(value, {name: "depositAmount"}) && !_.isNull(this.userService.userData.userSession.min_deposit) && !_.isUndefined(this.userService.userData.userSession.min_deposit))
                      value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.min_deposit;//this.localStorageService.get('amount');
                if (_.find(value, {name: "amount"}) && !_.isNull(this.userService.userData.userSession.min_deposit) && !_.isUndefined(this.userService.userData.userSession.min_deposit)){
                    value.dynamicAttrs['ng-model'] = parseInt(this.userService.userData.userSession.min_deposit,10);//this.localStorageService.get('amount');
                    value.attrs['min'] = parseInt(this.userService.userData.userSession.min_deposit,10);
                    let msgNew =  value.msgBox['min'];
                    value.msgBox['min'] =   msgNew.replace("{0}",this.userService.userData.userSession.min_deposit);
                
                }else if (_.find(value, {name: "first_name"})){
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.FirstName;
                }else if (_.find(value, {name: "last_name"})){
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.LastName;
                }else if (_.find(value, {name: "City"})){
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.City;
                }else if (_.find(value, {name: "address"})){
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.street;
                }else if (_.find(value, {name: "postal"})){
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.postCode;
                }else if (_.find(value, {name: "phone"})){
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.phoneView;
                }    
            } else if (value.element === 'ui-select-wrapper') {
                value.selected = _.find(value, {name: "Country"}) ? _.find(this.countriesService.getCountries(), {name: this.userService.userData.userSession.Country}) : {}; // phone prefix - determined by the user's country.
            }
        });
    }

    submitting() {        
        let formId = this.depositThreeDFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {            
            this.submit(formData);
        });
    }

    /**
     * @submit(async)
     * Submit function.
     * @param {object} form - Deposit 3D form data.
     * @result - prepare the object by the form, submit the object and open popup for failed and success.
     */
    submit(form) {
        let _this = this;
        let promoCodeValue = $('input[name="promo"]').val();        
        if (this.prelimenaryTestBonus != true && promoCodeValue!== '') {            
            this.formDataSend = form;            
        } else {           
            this.prelimenaryTestBonus = false;


            let formData = {};
            angular.forEach(form, (value, key) => { // loop on every field in form.
                if (value.element === 'select') {
                    if (value.attrs.name === 'card_type') // Check if the current field is card type select
                        formData[value.attrs.name] = value.dynamicAttrs['ng-model'].subItem.name.toUpperCase(); // if it does card type it's define the selected option name in upper case as value.
                    else
                        formData[value.attrs.name] = value.dynamicAttrs['ng-model'].id; // it's define the selected option id.
                } else if (value.element === 'ui-select-wrapper') // check if the field is phone
                    formData[value.attrs.name] = value.selected.code;
                else if (typeof value.dynamicAttrs['ng-model'] !== 'undefined') // check if the field is not empty
                    formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
            });

            formData['whoami'] = (!_.isUndefined(this.localStorageService.get('whoami'))) ? this.localStorageService.get('whoami') : "";
            formData.depositAmount = Number(formData.amount);
            formData.full_name = `${formData['first_name']}%20${formData['last_name']}`; // concat first name and last name
           
            if(this.localStorageService.get('PromoCode')) {
                formData.promo = $('input[name="promo"]').val();
                formData.field = `promo`;
            }else if(this.$cookies.get('promo_bonus')){
                formData.promo = $('input[name="promo"]').val();
                formData.field = `promo`;
            }
            
            if (this.$cookies.get('utm_tracker')) {
                formData.utm_tracker = this.$cookies.get('utm_tracker');
            }
            if (this.$scope.agreement_popup != 0) {
                formData.agreement_popup = 1;
            }

            this.popupsService.setDepositSuccessData(formData.amount, this.userService.userData.userSession.currency);
            let sessionParams = {
                country_id: this.userService.userData.userSession['country_id'],
                id: this.userService.userData.userSession.id,
                email: this.userService.userData.userSession['emailView'],
                currency: this.userService.userData.userSession.currency,
                referrer: this.referrer,
                brand: this.brand,
                processor_view: 0,
                postCode: formData.postal,
                FirstName: formData.first_name,
                LastName: formData.last_name
            };

            let params = _.merge(formData, sessionParams);


            this.depositThreeDService.setRequest(params).then((res) => {                
            }).catch((response) => {                
                this.popupsService.popItUp({
                    type: 'popup',
                    settemplate: 'failed',
                    yes: function () {
                        this.popupsService.popItDown();
                        this.$state.go('about');
                    }
                });
                this.$window.removeEventListener('message', onMessage);
            });

            let onMessage = (event) => {

                let self = this;
                if (event.origin === self.originService.depositApiUrl) { // Check if the message came from deposit 3d url.
                    this.$window.removeEventListener('message', onMessage);
                    let data = self.handleMessageData(event);                    
                    if (data.success && data['spot_success']) {
                        if (_.isUndefined(data['bonus_success'])) {
                            self.depositSuccess();
                        } else {
                            if (data['bonus_success']) {
                                if (data['bonus_type'] == 'max')
                                    self.depositSuccessBonusMaxed(data['bonus_amount']);
                                else
                                    self.depositSuccess();
                            } else {
                                if (data['bonus_type'] == 'max' || data['bonus_type'] == 'ok') {
                                    self.depositSuccessBonusFailed();
                                } else {
                                    self.depositSuccess();
                                }
                            }
                        }
                    } else if (data.success && !data['spot_success']) {
                        self.depositSuccessSpotFailed();
                    } else if (!data.success) {
                        self.depositFailed();
                    }
                }
            };

            this.$window.addEventListener('message', onMessage);

            /**
             * @listeningToSuccess
             * Listening to postMessage of success and failed.
             * @param {object} formData - Deposit 3D form data.
             * @result - listening to success and failed, close the iframe window and open the right popup.
             * Commented it out - seems like an unnecessary variable. Added the event above.
             */

            let listeningToSuccess = (formData) => { // Listening for Success/failed over postMessages.
                this.$window.addEventListener('message', onMessage);
            };

            listeningToSuccess(formData);
        }
    }

    handleMessageData(event) {
        let data = JSON.parse(event.data);
        data.success = Number(data.success);
        data['referrer_error_type'] = Number(data['referrer_error_type']);
        data['spot_success'] = Number(data['spot_success']);
        if (!_.isUndefined(data['bonus_success']))
            data['bonus_success'] = Number(data['bonus_success']);
        return data;
    }

    depositSuccess() {
        let self = this;
        self.popupsService.popItUp({
            type: 'popup', settemplate: 'success', cancel: function () {
                self.popupsService.popItDown();
                self.$state.go('trade');
            }
        });
        //Delete Cookies
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: this.domain,path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
        document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        //document.cookie = "PromoCode=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";


        this.$scope.$broadcast('bonusClose', "promo");
        self.$rootScope.$broadcast('autoSubmit.close'); // Close the iframe window.
        self.loadingFrameService.stopLoading();
        //self.$scope.$apply();
    }
    depositSuccessCustom(amount) {
        let self = this;
        let message = `
            You successfully deposited ${this.popupsService.depositCurrency}${amount}<br />Enjoy trading with us,<br />Hedgestone Group team.
        `;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Success',
            content: message,
            cancel: function () {
                self.popupsService.popItDown();
                self.$state.go('trade');
            }
        });
        //Delete Cookies
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: this.domain,path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
        document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        //document.cookie = "PromoCode=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        this.$scope.$broadcast('bonusClose', "promo");
        self.$rootScope.$broadcast('autoSubmit.close'); // Close the iframe window.
        self.loadingFrameService.stopLoading();
        //self.$scope.$apply();
    }

    depositFailedCustom(mess_error) {
        let self = this;
        let message = `
            Please, double-check the information you entered, change it, if needed, and retry entering it.<br />If you need to contact our support team, please, go to our About Us page.<br />Thanks, <br />Hedgestone Group Team. <br />${mess_error}
        `;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Deposit Failed',
            content: message,
            yes: function () {
                self.popupsService.popItDown();
                self.$state.go('about');
            }
        });

        self.$rootScope.$broadcast('autoSubmit.close'); // Close the iframe window.
        //self.$scope.$apply();
    }
    depositSuccessBonusMaxed(amount, maxPromoAmount) {
        let self = this;
        let message = `
            You successfully deposited ${this.popupsService.depositCurrency}${amount} . <br />
            Your promotion code activated on the ${maxPromoAmount} which is the maximum ammount for your Promo code.<br /><br />
            Thanks for your patience,<br />
            Hedgestone Group team.
        `;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Successful Deposit',
            content: message,
            cancel: function () {
                this.popupsService.popItDown();
                this.$state.go('about');
            }
        });
        document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        //document.cookie = "PromoCode=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        this.$scope.$broadcast('bonusClose', "promo");
        self.$rootScope.$broadcast('autoSubmit.close'); // Close the iframe window.
        self.loadingFrameService.stopLoading();
        //self.$scope.$apply();
    }

    depositSuccessSpotFailed() {
        let self = this;
        let message = `
            You successfully deposited <popup-amount-currency></popup-amount-currency>. <br />
            <span class="orange">But we still failed to update your account balance. <br />
            Please, contact your agent.</span><br /><br />
            Thanks for your patience,<br />
            Hedgestone Group team.
        `;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Please Notice',
            content: message,
            cancel: function () {
                this.popupsService.popItDown();
                this.$state.go('about');
            }
        });
        //Delete Cookies
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: this.domain,path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
        document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        //document.cookie = "PromoCode=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        this.$scope.$broadcast('bonusClose', "promo");
        self.$rootScope.$broadcast('autoSubmit.close'); // Close the iframe window.
        self.$scope.$apply();
    }

    depositFailed() {
        let self = this;
        self.popupsService.popItUp({
            type: 'popup', settemplate: 'failed', yes: function () {
                self.popupsService.popItDown();
                self.$state.go('about');
            }
        });
        self.$rootScope.$broadcast('autoSubmit.close'); // Close the iframe window.
        //self.$scope.$apply();
    }

    depositSuccessBonusFailed() {
        let self = this;
        let message = `
            You successfully deposited <popup-amount-currency></popup-amount-currency>. <br />
            <span class="orange">But we still failed to update your account balance with the Bonus.</span><br />
            Please, contact your account manager.<br /><br />
            Thanks for your patience,<br />
            Hedgestone Group team.
        `;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Successful Deposit',
            content: message,
            cancel: function () {
                this.popupsService.popItDown();
                this.$state.go('about');
            }
        });
        self.$rootScope.$broadcast('autoSubmit.close'); // Close the iframe window.
        self.$scope.$apply();
    }

    exeDeposit(param) {        
        if (param.status == true) {
            if (param.bonus_amount != 0) {
                this.depositSuccessBonusMaxed(param.bonus_amount, param.deposit_amount);
            } else {
                this.depositSuccessCustom(param.deposit_amount);
            }

        } else {
            this.depositFailedCustom(param.message);
        }

    }
}
