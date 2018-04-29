/*
 Created by bnaya on 28/01/16,
 @Component Name: ngField.drv
 @Description:
 @Params:
 @Return:
 @Methods:
 */
import './ng-field.less';

import confirmPassword from './confirm-password/confirm-password.drv';
import password from './password/password.drv';
import numeric from './numeric/numeric.drv';
import genericValidation from './generic-validation/generic-validation.drv';
import ngFileUpload from './ng-file-upload/ng-file-upload.drv';
import uiSelectWrapper from './ui-select-wrapper/ui-select-wrapper.drv';
import uiSelectWrapperurl from './ui-select-wrapperurl/ui-select-wrapperurl.drv';
import currencyList from  '../../../../../assets/jsons/currency.json'
import captcha from './captcha/captcha.drv';


export default angular.module('app.newForm.formGroup.ngField', [confirmPassword.name, password.name, uiSelectWrapper.name,uiSelectWrapperurl.name, ngFileUpload.name, numeric.name, genericValidation.name, captcha.name])
    .directive('ngField', ngFieldConfig);

function ngFieldConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ng-field.tpl.html'),
        controller: NgFieldController,
        controllerAs: 'ngField'
    }
}

class NgFieldController {
    constructor($scope, $rootScope, $timeout, userService, countriesService, birthdayService, authService) {
        this.ngFieldData = $scope.data;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.$scope = $scope;
        this.userService = userService;
        this.birthdayService = birthdayService;
        this.authService = authService;
        this.countriesService = countriesService;

        this.html = this.generateFieldDom();
        this.fieldInit();
    }

    fieldInit() {

        if(this.ngFieldData.attrs.name === 'Day')
            this.initBirthdayDate();

        this.$timeout(()=> {
            this.$rootScope.$broadcast(this.ngFieldData.attrs.name + 'IsReady');
        });

        this.$scope.$on(`${this.ngFieldData.attrs.name}Changed`, (event, newField) => {
            this.ngFieldData.field = newField;
        });

        if(this.ngFieldData.attrs.name === 'registeredCountry2') {
            this.userService.getUserGeoData().then((userGeoData) => {
                this.ngFieldData.dynamicAttrs['ng-model'] = userGeoData.countryName[0];
            });
        }

        // this.userService.getPersonalUserData().then((response) => {
        //     if(response.data.success)
        //         this.registeredCountry = response.data.message['Account_Settings']['Registration_country'];
        // }).catch(() => {
       
        // });

        this.promo = {};
    }

    validatePromoCode(event, name) {
        if(_.includes(this.ngFieldData.attrs.name.toLowerCase(), name)) {
            // this.userService.userData.promo.code = this.ngFieldData.dynamicAttrs['ng-model'];
            this.userService.userData.promo.code = $(`input[name="${name}Promo"]`).val();
            this.userService.userData.promo.amount = $(`input[name="${name}Amount"]`).val() || 0;
            this.userService.userData.promo.field = `${name}Promo`;
        } else {
            // this.userService.userData.promo.amount = this.ngFieldData.dynamicAttrs['ng-model'];
            this.userService.userData.promo.code = $('input[name="promo"]').val();
            this.userService.userData.promo.amount = $('input[name="amount"]').val() || $('input[name="depositAmount"]').val() || 0;
            this.userService.userData.promo.field = 'promo';
        }

        if(_.isEmpty(this.userService.userData.promo.code) || _.isEmpty(this.userService.userData.promo.amount) && this.userService.userData.promo.amount !== 0) {
            let broadCastParams = {
                success: false,
                field: this.ngFieldData.attrs.name
            };
            
            
            let targetUpdate = "bonusUpdate" + broadCastParams.field;
            
            this.$rootScope.$broadcast(targetUpdate, broadCastParams);
            return false;
        }
        let params = {
            amount: this.userService.userData.promo.amount,
            promo: this.userService.userData.promo.code,
            id: this.userService.userData.userSession.id,
            depositType: this.userService.userData.userSession.ftd ? '3d' : 'ftd',
            field: this.userService.userData.promo.field
        };
        //
        
        this.userService.validatePromoCode(params);
    }

    generateFieldDom() {
        let html = ``;
        if (this.ngFieldData.element === 'ui-select-wrapper')
            html = this.generateUiSelect();
        else {
            html = this.generateElement();
        }
        return html;
    }

    generateUiSelect() {
        let html = `<ui-select-wrapper data="ngField.ngFieldData"></ui-select-wrapper>`;
        return html;
    }

    generateElement() {
        if(this.userService.userData.isUserLogin && !_.isUndefined(this.userService.userData.userSession.testing) && this.userService.userData.userSession.testing) {
            this.ngFieldData.attrs.min = 0;
            this.ngFieldData.attrs.max = 99999999999999999;
        }

        let html = '';
        if (this.ngFieldData.withAddon) {
            let currency = _.find(currencyList, {"code": this.userService.userData.userSession.currency});
            let symbol = currency ? currency.symbol : this.userService.userData.userSession.currency;
            this.ngFieldData.addon = symbol;
            html += `<div class="input-group-addon" id="basic-addon1"><div class="input-group-addon-container" ng-bind-html="ngField.ngFieldData.addon | unsafe"></div></div>`;
            // html += `<span class="input-group-addon" id="basic-addon1" ng-bind-html="ngField.ngFieldData.addon | unsafe"></span>`;
        };

        html += `<${this.ngFieldData.element}`;
        angular.forEach(this.ngFieldData.attrs, (value, key) => {
            html += ` ${key}="${value}"`;
        });

        angular.forEach(this.ngFieldData.dynamicAttrs, (value, key) => {
            html += ` ${key}="ngField.ngFieldData.dynamicAttrs['${key}']"`;
        });
        html += this.selectInit();
        return html;
    }

    selectInit() {
        if (this.ngFieldData.element !== 'select')
            return '/>';
        if (typeof this.optionsInit()[this.ngFieldData.attrs.name] !== 'undefined') {
            this.optionsInit()[this.ngFieldData.attrs.name]();
        };
        let html = ` ng-options="option as option.label for option in ngField.ngFieldData.options track by option.id"`;
        html += `><option value="" selected disabled>{{ngField.ngFieldData.attrs.placeholder}}</option></${this.ngFieldData.element}>`;
        return html;
    }

    optionsInit() {
        let self = this;
        return {
            currency() {
                self.userService.getDefaultCurrency().then((response) => {
                    self.ngFieldData.dynamicAttrs['ng-model'] = _.find(self.ngFieldData.options, {"label": response});
                });
            },
            Year() {
                self.$scope.$evalAsync(() => {
                    let year = new Date().getFullYear();
                    let fromYear = year - 17;
                    let toYear = 96 - 17;
                    self.ngFieldData.options = [];
                    for (let i = 0; i < toYear; i++) {
                        self.ngFieldData.options.push({
                            "id": fromYear - i,
                            "label": fromYear - i,
                            "subItem": {"name": fromYear - i}
                        });
                    }
                });
            },
            "expire_year": ()=> {
                self.$scope.$evalAsync(() => {
                    let year = new Date().getFullYear();
                    self.ngFieldData.options = [];
                    for (let i = 0; i < 10; i++) {
                        self.ngFieldData.options.push({
                            "id": year + i,
                            "label": year + i,
                            "subItem": {"name": year + i}
                        });
                    }
                });
            }
        }
    }

    isDefined(someVar) {
        if (typeof someVar === 'undefined')
            return false;
        return true;
    }

    error() {
        if(_.isUndefined(this.ngFieldData.field) || _.isUndefined(this.ngFieldData.field[this.ngFieldData.attrs.name]))
            return false;
        return (!this.ngFieldData.field[this.ngFieldData.attrs.name].$valid && this.ngFieldData.field[this.ngFieldData.attrs.name].$touched || this.ngFieldData.field[this.ngFieldData.attrs.name].$valid && this.ngFieldData.field[this.ngFieldData.attrs.name].$optionalValid)
    }

    // fireDateChange() {
    //     if(_.isUndefined(this.ngFieldData.attrs['ng-change'])) {
    //         return false;
    //     }
    //
    //     return
    // }

    initBirthdayDate() {
        this.$rootScope.$on('Days Ready', (event, data) => {
            delete this.ngFieldData.attrs.disabled;
            this.ngFieldData.options = this.birthdayService.options.day;
            this.html = this.generateFieldDom();
            this.$scope.$digest();
        });

        this.$rootScope.$on('reset day', () => {           

            if(!(_.find(this.ngFieldData.options, this.ngFieldData.dynamicAttrs['ng-model']))) {
                this.ngFieldData.dynamicAttrs['ng-model'] = '';
            };
        });
    }

    changeYear() {
        this.birthdayService.setYear(this.ngFieldData.dynamicAttrs['ng-model'].id);
        this.$rootScope.$broadcast('reset day');
        this.birthdayService.calculateDay();
    }

    changeMonth() {
        this.birthdayService.setMonth(Number(this.ngFieldData.dynamicAttrs['ng-model'].id));
        this.$rootScope.$broadcast('reset day');
        this.birthdayService.calculateDay();
    }
}
