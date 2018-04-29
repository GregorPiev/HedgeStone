/**
 * Created by saar on 04/09/16.
 */

import './skrill-form.less';

export default angular.module('app.page.section.skrill-form', [])
        .directive('skrillForm', skrillFormConfig);

function skrillFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./skrill-form.tpl.html'),
        controller: skrillFormController,
        controllerAs: 'skrillForm'
    }
}

class skrillFormController {
    /**
     * @constructor
     * construct function, define variables and initial form data.
     * @purpose - define variables and initial class.
     */
    constructor($scope, domFactory, userService, depositThreeDService, $window, originService, popupsService, loadingFrameService, $state, localStorageService, $timeout, $rootScope, $cookies, requestHandlerService, $location) {
        this.$scope = $scope;
        this.originService = originService;
        this.$state = $state;
        this.loadingFrameService = loadingFrameService;
        this.depositThreeDService = depositThreeDService;
        this.popupsService = popupsService;
        this.localStorageService = localStorageService;
        this.$timeout = $timeout;
        this.skrillFormData = $scope.data;
        this.$window = $window;
        this.$rootScope = $rootScope;
        this.userService = userService;
        this.$cookies = $cookies;
        this.$location = $location;
        this.requestHandlerService = requestHandlerService;
        this.domain = ($location.$$host === 'localhost') ? "" : ".hedgestonegroup.com";
        $scope.agreement_popup = false;

        this.html = '';
        this.html = domFactory.generateArray(this.skrillFormData, 'skrillForm', 'skrillFormData');
        this.submitting();
        this.autoFillFileds();
        this.checkMinimumAmount();
        this.prelimenaryTestBonus = false;
        this.formDataSend = '';

        let _this = this;
        
        this.$scope.$on('bonusUpdateskrillPromo', (e, param) => {            
            if (param.success) {
                param.field = "skrillPromo";
                if (param.agreement_popup != 0) {
                    _this.popupsService.popItUp({
                        type: 'popup',
                        settemplate: 'confirm',
                        headline: 'Bonus Option',
                        content: `In order to receive your bonus please agree with <a href='https://dev-staging.hedgestonegroup.com/assets/legal/Hedgestone_bonus_policy.pdf' target='_blank'>bonusT&C</a>.<br>With pressing Disagree You will not be entitled to receive to the Bonus`,
                        yesbtntitle: 'I agree',
                        nobtntitle: 'Disagree',
                        yes: function () {
                            $scope.agreement_popup = true;
                            _this.prelimenaryTestBonus = true;
                            _this.popupsService.popItDown();
                            _this.$scope.$broadcast('bonusUpdatePromoSkrill', param);
                            if (_this.formDataSend != '') {
                                _this.submit(_this.formDataSend);
                            }
                        },
                        no: function () {
                            _this.prelimenaryTestBonus = true;
                            _this.popupsService.popItDown();
                            _this.$scope.$broadcast('bonusUpdatePromoSkrill', param);
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
            if (data.title === 'Skrill') {
                let promo_bonus = (this.localStorageService.get('PromoCode')) ? this.localStorageService.get('PromoCode') : ((this.$cookies.get('promo_bonus')) ? this.$cookies.get('promo_bonus') : false);
                if (promo_bonus) { 
                   let skrillAmount = $('input[name="skrillAmount"]').val(); 
                   let  dirElementInputScrill=$('input[name="skrillPromo"]');
                   angular.element(dirElementInputScrill).val(promo_bonus).trigger('input').trigger('focus');
                   let params = {
                        field: "skrillPromo",
                        amount: skrillAmount,
                        promo: promo_bonus,
                        id: _this.userService.userData.userSession.id,
                        depositType: _this.userService.userData.userSession.ftd ? '3d' : 'ftd'
                   };
                   let resultValidate = _this.userService.validatePromoCode(params);
                }   
                
                if (!this.$cookies.get('promo_bonus')) {
                    this.$scope.$broadcast('bonusClose', "skrillPromo");
                }
            }
        });



    }

    autoFillFileds() {        
        let fields = _.findKeyInObj(this.skrillFormData, "element");        
        // Define data from session to form fields.
        angular.forEach(fields, (value, key) => {
            if (_.find(value, {name: "skrillAmount"}) && !_.isNull(this.localStorageService.get('amount')) && !_.isUndefined(this.localStorageService.get('amount')))
                value.dynamicAttrs['ng-model'] = this.localStorageService.get('amount');
            //else if (_.find(value, {name: "skrillPromo"}) && !_.isNull(this.localStorageService.get('promoCode')) && !_.isUndefined(this.localStorageService.get('promoCode')))
                //value.dynamicAttrs['ng-model'] = this.localStorageService.get('promoCode');
        });
        //this.forgotPromoCode();
    }

    checkMinimumAmount() {
        let currency = this.userService.userData.userSession.currency;
        if (currency === 'AUD' || currency === 'CAD') {
            let inputs = _.findKeyInObj(this.skrillFormData, 'msgBox');
            let amountInput = _.find(inputs, {attrs: {name: 'skrillAmount'}});
            amountInput.dynamicAttrs['ng-model'] = 350;
            amountInput.attrs.min = 350;
            amountInput.msgBox.min = `The minimum deposit amount stands on 350.`;
        } else
            return;
    }

    forgotPromoCode() {
        this.$timeout(() => {
            //this.localStorageService.remove('promoCode');
            //this.localStorageService.remove('amount');
        }, 3000);
    }

    submitting() {        
        let formId = this.skrillFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {
            this.submit(formData);
        })
    }

    submit(form) {
        let _this = this;
        if (this.prelimenaryTestBonus != true && $('input[name="skrillPromo"]').val() != '') {            
            this.formDataSend = form;
        } else {            
            this.prelimenaryTestBonus = false;



            let formData = {};
            if (this.localStorageService.get('PromoCode') || this.$cookies.get('promo_bonus')) {
                let formDataCur = {};

                angular.forEach(form, (value, key) => { // loop on every field in form.
                    if (typeof value.dynamicAttrs['ng-model'] !== 'undefined') // check if the field is not empty
                        formDataCur[value.attrs.name] = value.dynamicAttrs['ng-model'];
                });
                formData.id = this.userService.userData.userSession.id;
                formData.currency = this.userService.userData.userSession.currency;
                formData.promo = $('input[name="skrillPromo"]').val();
                formData.amount = `${formDataCur.skrillAmount}.00`;
                formData.field = `skrillPromo`;
                formData.depositType = this.userService.userData.userSession.ftd ? '3d' : 'ftd'
            } else {
                angular.forEach(form, (value, key) => { // loop on every field in form.
                    if (typeof value.dynamicAttrs['ng-model'] !== 'undefined') // check if the field is not empty
                        formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
                });

                formData.id = this.userService.userData.userSession.id;
                formData.currency = this.userService.userData.userSession.currency;
                formData.promo = formData.skrillPromo;
                formData.amount = `${formData.skrillAmount}.00`;
                formData.ftd = this.userService.userData.userSession.ftd ? 0 : 1;
            }
            
            
           
            
            
            if (this.$cookies.get('utm_tracker')) {
                formData.utm_tracker = this.$cookies.get('utm_tracker');
            }
            if (this.$scope.agreement_popup) {
                formData.agreement_popup = 1;
            }
            

            this.popupsService.setDepositSuccessData(formData.amount, this.userService.userData.userSession.currency);
            // let skrillWindow = this.$window.open('', 'new', `width=${this.$window.innerWidth / 2}, height=${this.$window.innerHeight / 2}`);
            this.depositThreeDService.depositSkrill(formData).then((response) => {
                // skrillWindow.location = response.data.redirect_url;
                this.$rootScope.$broadcast('autoSubmit.redirect', response.data.redirect_url); // Fire the redirect url in the response.data to autoSubmit component.
            });

            let onMessage = (event) => {
                let self = this;                
                if (event.origin === self.originService.depositApiUrlWallet) { // Check if the message came from skrill url.
                    this.$window.removeEventListener('message', onMessage);
                    let data = JSON.parse(event.data);
                    let txId = data.transactionId;
                    if (data.success && !data.message) {
                        self.depositSuccess(txId);
                    } else if (data.success && data.message) {
                        self.depositSuccessSpotFailed(txId);
                    } else if (!data.success && data.message) {
                        switch (data.message) {
                            case 'DeclinedByCustomer':
                                {
                                    self.depositDeclinedByCustomer(txId);
                                }
                                break;

                            default:
                                {
                                    self.depositFailed(txId)
                                }
                                break;
                        }
                        self.$scope.$apply();
                    }
                }
            };

            /**
             * @listeningToSuccess
             * Listening to postMessage of success and failed.
             * @param {object} formData - Deposit 3D form data.
             * @result - listening to success and failed, close the iframe window and open the right popup.
             */
            let listeningToSuccess = (formData) => { // Listening for Success/failed over postMessages.
                this.$window.addEventListener('message', onMessage);
            };

            listeningToSuccess(formData);
        }
    }

    depositTimeout() {
        this.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Failed',
            content: `The Skrill service is not responding. <br>We are sorry for the inconvenience. You are welcome to try again later, or to select an alternate payment method. <br>If you require assistance, please contact our customer support: <a href="mailto:support@hedgestonegroup.com">support@hedgestonegroup.com</a>`
        });
    }

    depositSuccess(txId) {
        let self = this;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Success',
            content: `You successfully deposited <popup-amount-currency></popup-amount-currency>, Transaction ID ${txId} was created.<br> Enjoy trading with us, The Hedgestone Group`,
            cancel: function () {
                self.popupsService.popItDown();
            }
        });
        //skrillWindow.close();
        //Delete Cookies
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: '',path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
        document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        //document.cookie = "PromoCode=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        this.$scope.$broadcast('bonusClose', "skrillPromo");        
        this.$rootScope.$broadcast('autoSubmit.close');
        self.$scope.$apply();
        this.userService.reloadDataToSession();
    }

    depositSuccessSpotFailed(txId) {
        let self = this;
        let message = `You successfully deposited <popup-amount-currency></popup-amount-currency>, But unfortunately due to some technical errors your account balance was not updated accordingly. Transaction ID ${txId} was created. <br>Please provide this reference number if you wish to contact our support representatives. <a ui-sref="about">Click Here</a> in order to contact our support representatives. <br>Thanks, The Hedgestone Group`;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Please Notice',
            content: message,
            cancel: function () {
                self.popupsService.popItDown();
            }
        });
        // skrillWindow.close();
        //Delete Cookies
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: this.domain,path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
        document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        //document.cookie = "PromoCode=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        this.$scope.$broadcast('bonusClose', "skrillPromo");
        this.$rootScope.$broadcast('autoSubmit.close');

        self.$scope.$apply();
        this.userService.reloadDataToSession();
    }

    depositDeclinedByCustomer(txId) {
        let self = this;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Deposit was Cancelled',
            content: `The deposit attempt was explicitly cancelled by ${this.userService.userData.userSession.FirstName} ${this.userService.userData.userSession.LastName}. Transaction ID ${txId} was created. Please provide this reference number if you wish to contact our support representatives.  <a ui-sref="about">Click Here</a> in order to contact our support representatives.<br> Thanks, The Hedgestone Group.`,
            cancel: function () {
                self.popupsService.popItDown();
            }
        });
        // skrillWindow.close();
        this.$rootScope.$broadcast('autoSubmit.close');
        self.$scope.$apply();
    }

    depositFailed(txId) {
        let self = this;
        self.popupsService.popItUp({
            type: 'popup',
            settemplate: 'custom',
            headline: 'Deposit Failed',
            content: `The deposit attempt was not processed successfully. Transaction ID ${txId} was created. Please provide this reference number if you wish to contact our support representatives. <a ui-sref="about">Click Here</a> in order to contact our support representatives.<br> Thanks, The Hedgestone Group.`,
            cancel: function () {
                self.popupsService.popItDown();
            }
        });
        // skrillWindow.close();
        this.$rootScope.$broadcast('autoSubmit.close');
        self.$scope.$apply();
    }
}
