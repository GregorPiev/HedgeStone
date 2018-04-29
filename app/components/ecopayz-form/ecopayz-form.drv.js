/**
 * Created by saar on 6/15/16.
 */

import './ecopayz-form.less';

export default angular.module('app.page.section.ecopayz', [])
        .directive('ecopayzForm', ecopayzFormConfig);

function ecopayzFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ecopayz-form.tpl.html'),
        controller: ecopayzFormController,
        controllerAs: 'ecopayzForm'
    }
}

class ecopayzFormController {
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
        this.ecopayzFormData = $scope.data;
        this.$window = $window;
        this.$rootScope = $rootScope;
        this.userService = userService;
        this.$cookies = $cookies;
        this.$location = $location;
        this.requestHandlerService = requestHandlerService;
        this.domain = ($location.$$host === 'localhost') ? "" : ".hedgestonegroup.com";
        $scope.agreement_popup = false;

        this.html = '';
        this.html = domFactory.generateArray(this.ecopayzFormData, 'ecopayzForm', 'ecopayzFormData');
        this.submitting();
        this.autoFillFileds();
        this.checkMinimumAmount();
        this.prelimenaryTestBonus = false;
        this.formDataSend = '';

        let _this = this;

//        $timeout(() => {
//            
//            let promo_bonus = (this.$cookies.get('PromoCode')) ? this.$cookies.get('PromoCode') : ((this.$cookies.get('promo_bonus')) ? this.$cookies.get('promo_bonus') : false);
//            if (promo_bonus) {
//                //document.cookie="promo_bonus=TestYesFTD"
//                //let ecopayzAmount = $('input[name="ecopayzAmount"]').val();
//                $('input[name="ecopayzPromo"]').val(promo_bonus);

//                let params = {
//                    field: "ecopayzPromo",
//                    amount: ecopayzAmount,
//                    promo: promo_bonus,
//                    id: _this.userService.userData.userSession.id,
//                    depositType: _this.userService.userData.userSession.ftd ? '3d' : 'ftd'
//                };
//                let resultValidate = _this.userService.validatePromoCode(params);
//            }
//        }, 150);

        this.$scope.$on('bonusUpdateecopayzPromo', (e, param) => {
           
            if (param.success) {
                param.field = "ecopayzPromo";
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
                            _this.$scope.$broadcast('bonusUpdatePromoEcoPayz', param);
                            if (_this.formDataSend != '') {
                                _this.submit(_this.formDataSend);
                            }
                        },
                        no: function () {
                            _this.prelimenaryTestBonus = true;
                            _this.popupsService.popItDown();
                            _this.$scope.$broadcast('bonusUpdatePromoEcoPayz', param);
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
            if (data.title === 'ecoPayz') {
               let promo_bonus = (this.localStorageService.get('PromoCode')) ? this.localStorageService.get('PromoCode') : ((this.$cookies.get('promo_bonus')) ? this.$cookies.get('promo_bonus') : false);
               if (promo_bonus) { 
                     let ecopayzAmount = $('input[name="ecopayzAmount"]').val();
                     let  dirElementInputEco='input[name="ecopayzPromo"]';
                     angular.element(dirElementInputEco).val(promo_bonus).trigger('input');
                     let params = {
                        field: "ecopayzPromo",
                        amount: ecopayzAmount,
                        promo: promo_bonus,
                        id: _this.userService.userData.userSession.id,
                        depositType: _this.userService.userData.userSession.ftd ? '3d' : 'ftd'
                     };
                  let resultValidate = _this.userService.validatePromoCode(params);
                     
               }
                if (!this.$cookies.get('promo_bonus')) {                    
                    this.$scope.$broadcast('bonusClose', "ecopayzPromo");
                }
            }
        });

    }

    autoFillFileds() {
        let fields = _.findKeyInObj(this.ecopayzFormData, "element");
        // Define data from session to form fields.
        angular.forEach(fields, (value, key) => {
            if (_.find(value, {name: "ecopayzAmount"}) && !_.isNull(this.localStorageService.get('amount')) && !_.isUndefined(this.localStorageService.get('amount')))
                value.dynamicAttrs['ng-model'] = this.localStorageService.get('amount');
            //else if (_.find(value, {name: "ecopayzPromo"}) && !_.isNull(this.localStorageService.get('promoCode')) && !_.isUndefined(this.localStorageService.get('promoCode')))
                //value.dynamicAttrs['ng-model'] = this.localStorageService.get('promoCode');
        });

        //this.forgotPromoCode();
    }

    checkMinimumAmount() {
        let currency = this.userService.userData.userSession.currency;
        if (currency === 'AUD' || currency === 'CAD') {
            let inputs = _.findKeyInObj(this.ecopayzFormData, 'msgBox');
            let amountInput = _.find(inputs, {attrs: {name: 'ecopayzAmount'}});
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
        
        let formId = this.ecopayzFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {
            this.submit(formData);
        })
    }

    submit(form) {
        let _this = this;
        if (this.prelimenaryTestBonus != true && $('input[name="ecopayzPromo"]').val() != '') {
            
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
                formData.promo =  $('input[name="ecopayzPromo"]').val();
                
                formData.amount = `${formDataCur.ecopayzAmount}.00`;
                formData.field = `ecopayzPromo`;
                formData.depositType = this.userService.userData.userSession.ftd ? '3d' : 'ftd'
            } else {
                angular.forEach(form, (value, key) => { // loop on every field in form.
                    if (typeof value.dynamicAttrs['ng-model'] !== 'undefined') // check if the field is not empty
                        formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
                });

                formData.id = this.userService.userData.userSession.id;
                formData.currency = this.userService.userData.userSession.currency;
                formData.promo = formData.ecopayzPromo;
                formData.amount = `${formData.ecopayzAmount}.00`;
                formData.ftd = this.userService.userData.userSession.ftd ? 0 : 1;
            }
            
            if (this.$cookies.get('utm_tracker')) {
                formData.utm_tracker = this.$cookies.get('utm_tracker');
            }
            
            if (this.$scope.agreement_popup != 0) {
                formData.agreement_popup = 1;
            }

            this.popupsService.setDepositSuccessData(formData.amount, this.userService.userData.userSession.currency);
            let ecopayzWindow = this.$window.open('', 'new', `width=${this.$window.innerWidth / 2}, height=${this.$window.innerHeight / 2}`);
            this.depositThreeDService.depositEcopayz(formData).then((response) => {
                ecopayzWindow.location = response.data.redirect_url;
            });
            let onMessage = (event) => {
                let self = this;
                
                if (event.origin === self.originService.depositApiUrlWallet) { // Check if the message came from ecopayz url.
                    this.$window.removeEventListener('message', onMessage);
                    let data = JSON.parse(event.data);
                    let txId = data.transactionId;
                    if (data.success && !data.message) {
                        self.depositSuccess(ecopayzWindow, txId);
                    } else if (data.success && data.message) {
                        self.depositSuccessSpotFailed(ecopayzWindow, txId);
                    } else if (!data.success && data.message) {
                        switch (data.message) {
                            case 'DeclinedByCustomer':
                                {
                                    self.depositDeclinedByCustomer(ecopayzWindow, txId);
                                }
                                break;

                            default:
                                {
                                    self.depositFailed(ecopayzWindow, txId)
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
            content: `The ecoPayz service is not responding. <br>We are sorry for the inconvenience. You are welcome to try again later, or to select an alternate payment method. <br>If you require assistance, please contact our customer support: <a href="mailto:support@hedgestonegroup.com">support@hedgestonegroup.com</a>`
        });
    }

    depositSuccess(ecopayzWindow, txId) {
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
        //Delete Cookies
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: this.domain,path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
        document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        //document.cookie = "PromoCode=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        this.$scope.$broadcast('bonusClose', "ecopayzPromo");

        ecopayzWindow.close();
        self.$scope.$apply();
        this.userService.reloadDataToSession();
    }

    depositSuccessSpotFailed(ecopayzWindow, txId) {
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
        //Delete Cookies
//        this.$cookies.remove('promo_bonus',{path:'/deposit'});
//        this.$cookies.remove('promo_bonus',{domain: this.domain,path:'/'});
//        this.$cookies.remove('utm_tracker',{domain: this.domain,path:'/'});
        document.cookie = "promo_bonus=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        //document.cookie = "PromoCode=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "utm_tracker=;domain=.hedgestonegroup.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        this.$scope.$broadcast('bonusClose', "ecopayzPromo");
        ecopayzWindow.close();
        self.$scope.$apply();
        this.userService.reloadDataToSession();
    }

    depositDeclinedByCustomer(ecopayzWindow, txId) {
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
        ecopayzWindow.close();
        self.$scope.$apply();
        this.userService.reloadDataToSession();
    }

    depositFailed(ecopayzWindow, txId) {
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
        ecopayzWindow.close();
        self.$scope.$apply();
    }
}
