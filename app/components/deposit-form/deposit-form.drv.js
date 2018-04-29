/*
 Created by bnaya on 28/01/16,
 @Component Name: page.drv
 @Description:
 @Params:
 @Return:
 @Methods:
*/

import './deposit-form.less';

export default angular.module('app.page.section.depositForm', [])
    .directive('depositForm', depositFormConfig);

function depositFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./deposit-form.tpl.html'),
        controller: depositFormController,
        controllerAs: 'depositForm'
    }
}

class depositFormController {
    /**
     * @constructor
     * construct function, define variables and initial form data.
     * @purpose - define variables and initial class.
     */

    constructor($scope, depositService, userService, domFactory, loadingFrameService, popupsService,$window,localStorageService, $timeout, countriesService, $state,$cookies,requestHandlerService,$location) {
        this.depositFormData = $scope.data;
        this.countriesService = countriesService;
        this.depositService = depositService;
        this.userService = userService;
        this.$window = $window;
        this.localStorageService = localStorageService;
        this.popupsService = popupsService;
        this.loadingFrameService = loadingFrameService;
        this.$state = $state;
        this.$timeout = $timeout;
        this.$scope = $scope;

        this.$cookies=$cookies;
        this.$location=$location;
        this.domain = ($location.$$host === 'localhost') ? "" : ".hedgestonegroup.com";
        this.requestHandlerService = requestHandlerService;
        //console.log('session', this.userService.userData.userSession);

        this.html = "";
        this.html = domFactory.generateArray(this.depositFormData, 'depositForm', 'depositFormData');

        this.checkMinimumAmount();
        this.autoFillFileds();
        this.submitting();

        let _this=this;
        
        //console.info("%cFTD Form","color:fuchsia;");
        $timeout(() => { 
            $('[name*=amount]').focus();
        }, 0); 
        
        
         $timeout(() => {
                //console.info("%cCookies Deposit:" + JSON.stringify(this.$cookies.getAll()),"color:purple;");
                let promo_bonus=(this.$cookies.get('promo_bonus'))? this.$cookies.get('promo_bonus'):false;
                if(promo_bonus){
                    //document.cookie="promo_bonus=TestYesFTD;path=/;"
                    let depositAmount = $('input[name=depositAmount').val();                            
                    $('input[name="promo"').val(promo_bonus);

                    let params = {
                                    field:"promo",
                                    amount: depositAmount,
                                    promo: promo_bonus,
                                    id: _this.userService.userData.userSession.id,
                                    depositType: _this.userService.userData.userSession.ftd ? '3d' : 'ftd'
                    };                    
                    let resultValidate=_this.userService.validatePromoCode(params);
                }
        }, 50); 

        this.$scope.$on('bonusUpdatepromo', (e, param) => {
                        //console.log("%c Result Bonus Update Deposit:" + JSON.stringify(param),"color: orange;");
                        if(param.success){ 
                            param.field="promo";
                            _this.$scope.$broadcast('bonusUpdatePromo', param);                            
                        }
        });

        $scope.$on('tabBtn', (event, data) => {            
          if(data.title==='Card')  {   
                //console.log("%ctabBtn Card Title:" + data.title,"color: indigo;");
                if(!this.$cookies.get('promo_bonus')){
                    this.$scope.$broadcast('bonusClose',"Promo");
                }
          }   
        });

    }

    autoFillFileds() {
        let fields = _.findKeyInObj(this.depositFormData, "element");
        // Define data from session to form fields.

        angular.forEach(fields, (value, key) => {
            // _.find(value, {name: "FirstName"}) ? this.userService.userData.userSession.FirstName :
            //     _.find(value, {name: "LastName"}) ? this.userService.userData.userSession.LastName :
            //     _.find(value, {name: "City"}) ? this.userService.userData.userSession.City :
            //     _.find(value, {name: "address"}) ? this.userService.userData.userSession.street :
            //     _.find(value, {name: "postCode"}) ? this.userService.userData.userSession.postCode :
            //     _.find(value, {name: "phone"}) ? this.userService.userData.userSession.phoneView :
            //     (_.find(value, {name: "promo"}) && !_.isNull(this.localStorageService.get('promoCode')) && !_.isUndefined(this.localStorageService.get('promoCode'))) ? this.localStorageService.get('promoCode') : "";
            if (value.element === 'input') {
                if (_.find(value, {name: "depositAmount"}) && !_.isNull(this.localStorageService.get('amount')) && !_.isUndefined(this.localStorageService.get('amount')))
                    value.dynamicAttrs['ng-model'] = this.localStorageService.get('amount');
                else if (_.find(value, {name: "promo"}) && !_.isNull(this.localStorageService.get('promoCode')) && !_.isUndefined(this.localStorageService.get('promoCode')))
                    value.dynamicAttrs['ng-model'] = this.localStorageService.get('promoCode');
                else if (_.find(value, {name: "FirstName"}))
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.FirstName;
                else if (_.find(value, {name: "LastName"}))
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.LastName;
                else if (_.find(value, {name: "City"}))
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.City;
                else if (_.find(value, {name: "address"}))
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.street;
                else if (_.find(value, {name: "postCode"}))
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.postCode;
                else if (_.find(value, {name: "phone"}))
                    value.dynamicAttrs['ng-model'] = this.userService.userData.userSession.phoneView;
            } else if (value.element === 'ui-select-wrapper') {
                value.selected = _.find(value, {name: "Country"}) ? _.find(this.countriesService.getCountries(), {name: this.userService.userData.userSession.Country}) : {}; // phone prefix - determined by the user's country.
            }
        });

        this.forgotPromoCode();
    }

    checkMinimumAmount() {
        let currency = this.userService.userData.userSession.currency;
        if(currency === 'AUD' || currency === 'CAD') {
            let inputs = _.findKeyInObj(this.depositFormData, 'msgBox');
            let amountInput = _.find(inputs, {attrs: {name: 'depositAmount'}});
            amountInput.dynamicAttrs['ng-model'] = 350;
            amountInput.attrs.min = 350;
            amountInput.msgBox.min = `The minimum deposit amount stands on 350.`;
        } else return;
    }

    forgotPromoCode() {
        this.$timeout(() => {
            this.localStorageService.remove('promoCode');
            this.localStorageService.remove('amount');
        }, 3000);
    }

    submitting() {
        let formId = this.depositFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {
            //console.log('formData', formData);
            this.submit(formData);
        });
    }    

    /**
     * @submit(async)
     * Submit function.
     * @param {object} form - Deposit form data.
     * @result - prepare the object by the form, submit the object and open popup for failed and success.
     */
    submit(form) {        
        let self = this;
        let formData = {};
        angular.forEach(form, (value, key) => { // loop on every field in form.
            if(value.element === 'select') {
                if(value.attrs.name === 'card_type') // Check if the current field is card type select
                    formData[value.attrs.name] = value.dynamicAttrs['ng-model'].subItem.name.toUpperCase(); // if it does card type it's define the selected option name in upper case as value.
                else
                    formData[value.attrs.name] = value.dynamicAttrs['ng-model'].id; // it's define the selected option id.
            }
            else if(value.element === 'ui-select-wrapper') // check if the field is phone
                formData[value.attrs.name] = value.selected.code;
            else if(typeof value.dynamicAttrs['ng-model'] !== 'undefined') // check if the field is not empty
                formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
        });
        if(this.$cookies.get('promo_bonus')){
             formData.promo = this.$cookies.get('promo_bonus');
        }
        if(this.$cookies.get('utm_tracker')){
            formData.utm_tracker = this.$cookies.get('utm_tracker');
        }
        //formData.amount = Number(formData.amount);
        formData['whoami'] = (!_.isUndefined(this.localStorageService.get('whoami'))) ? this.localStorageService.get('whoami') : "";

        let sessionParams = {
            country_id: this.userService.userData.userSession['country_id'],
            id: this.userService.userData.userSession.id,
            email: this.userService.userData.userSession['emailView'],
            currency: this.userService.userData.userSession.currency
        };

        let params = _.merge(formData, sessionParams);

//        let success = (response) => {
//            let data = response.data;
//            if(data.success) {
//                this.popupsService.setDepositSuccessData(formData.depositAmount, this.userService.userData.userSession.currency);
//                if(_.isUndefined(data['bonus_success']))
//                    self.depositSuccess();
//                else if(data['bonus_success'])  {
//                    if(data['bonus_type'] == 'max')
//                        self.depositSuccessBonusMaxed(data['bonus_amount']);
//                    else
//                        self.depositSuccess();
//                } else {
//                    if(data['bonus_type'] == 'max' || data['bonus_type'] == 'ok') {
//                        self.depositSuccessBonusFailed();
//                    } else {
//                        self.depositSuccess();
//                    }
//                }
//                this.userService.reloadDataToSession();
//            } else {
//                self.depositFailed();
//            }
//        };

//        let popupSettings = { //Gregori
//            settemplate: 'failed',
//            yes: function() { this.popupsService.popItDown(); this.$state.go('about'); }
//        };
        
        
        let popupSettings = {
            settemplate: 'failed',
            yes: function() { this.popupsService.popItUp({
                    type: 'popup',
                    settemplate: 'failed',
                    yes: function () {
                    this.popupsService.popItDown();
                    this.$state.go('about');
                }
            }); this.$state.go('about'); }
        };

        this.popupsService.setDepositSuccessData(formData.amount, this.userService.userData.userSession.currency);
        //this.depositService.depositingCreditCard(params, popupSettings).then(success); //Gregori
        this.depositService.depositingCreditCard(params, popupSettings).then((res) => {
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
                //console.log('data', data);
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

    handleMessageData(event) {
        let data = JSON.parse(event.data);
        data.success = Number(data.success);
        data['referrer_error_type'] = Number(data['referrer_error_type']);
        data['bonus_success'] = Number(data['bonus_success']);
        return data;
    }

    depositSuccess() {
        //console.info('%cdepositSuccess',"color:blue;");
        //Delete Cookies 
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: this.domain,path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
          document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        
        this.$scope.$broadcast('bonusClose',"promo");

        this.userService.userData.userSession.ftd = true;
        // this.popupsService.setDepositSuccessData(formData.depositAmount, this.userService.userData.userSession.currency);
        this.popupsService.popItUp({type: 'popup', settemplate:'success', cancel: function() { this.popupsService.popItDown(); this.$state.go('trade'); }});
    }

    depositSuccessSpotFailed() {

        alert('depositSuccessSpotFailed');
        //Delete Cookies 
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: this.domain,path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
          document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";  
        
        this.$scope.$broadcast('bonusClose',"promo");
        

        let self = this;
        let message = `
            You successfully deposited <popup-amount-currency></popup-amount-currency>. <br />
            <span class="orange">But we still failed to update your account balance. <br />
            Please, contact your agent.</span><br /><br />
            Thanks for your patience,<br />
            Hedgestone Group team.
        `;
        self.popupsService.popItUp({type: 'popup', settemplate:'custom', headline: 'Please Notice', content: message, cancel: function() { this.popupsService.popItDown(); this.$state.go('about'); }});
    }

    depositFailed() {
        let self = this;
        self.popupsService.popItUp({type: 'popup', settemplate:'failed', yes: function() { self.popupsService.popItDown(); self.$state.go('about'); }});
    }

    depositSuccessBonusMaxed(maxPromoAmount) {
        let self = this;
        let message = `
            You successfully deposited <popup-amount-currency></popup-amount-currency>. <br />
            Your promotion code activated on the ${maxPromoAmount} which is the maximum ammount for your Promo code.<br /><br />
            Thanks for your patience,<br />
            Hedgestone Group team.
        `;
        self.popupsService.popItUp({type: 'popup', settemplate:'custom', headline: 'Successful Deposit', content: message, cancel: function() { this.popupsService.popItDown(); this.$state.go('about'); }});
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
        self.popupsService.popItUp({type: 'popup', settemplate:'custom', headline: 'Successful Deposit', content: message, cancel: function() { this.popupsService.popItDown(); this.$state.go('about'); }});
    }
}
