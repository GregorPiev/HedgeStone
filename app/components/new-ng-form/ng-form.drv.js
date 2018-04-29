/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngForm.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import ngFormSubmit from './ng-form-submit/ng-form-submit.drv';
//import ngCheckbox from 'form-group/ng-field/ng-checkbox/ng-checkbox.drv';
import formGroup from './form-group/form-group.drv';

import './ng-form.less';

export default angular.module('app.newForm', [formGroup.name, ngFormSubmit.name])
    .directive('newForm', ngFormConfig);

function ngFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            submit: '=?',
            data: '='
        },
        template: require('./ng-form.tpl.html'),
        controller: NgFormController,
        controllerAs: 'inForm'
    }
}


class NgFormController {
    constructor($rootScope, $scope, authService, userService, $state, depositThreeDService, depositService, popupsService, localStorageService, $stateParams, $window, originService, domFactory) {
        this.formData = $scope.data;
        if(typeof $scope.submit !== 'undefined')
            this.submit = _.debounce($scope.submit, 300);

        //this.html = "";
        this.html = domFactory.generateArray(this.formData, 'inForm', 'formData');

        // Public services:
        this.$stateParams = $stateParams;
        this.authService = authService;
        this.userService = userService;
        this.originService = originService;
        this.$state = $state;
        this.userService = userService;
        this.depositThreeDService = depositThreeDService;
        this.depositService = depositService;
        this.popupsService = popupsService;
        this.localStorageService = localStorageService;
        this.$window = $window;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.submit = _.debounce(this.debounceSubmitting, 300);
    }

    debounceSubmitting() {
        let fields = _.findKeyInObj(this.formData, 'element');
        this.$rootScope.$broadcast(`${this.formData.id}Submitting`, fields);
    }

    submitting(form) {
        this.submit();
    }

    verify(form) {
        if(form.$invalid) {
            angular.forEach(form.$error, (field) => {
                angular.forEach(field, (errorField) => {
                    angular.forEach(errorField.$error, (field, key) => {
                        if(key === 'recaptcha') {
                            let genericValidateParams = {
                                message: `Please confirm`,
                                isOptionalValid: false
                            };
                            this.$rootScope.$broadcast(`captchaGenericValid`, genericValidateParams);
                        } else {
                            angular.forEach(field, (errorField) => {
                                errorField.$setTouched();
                            });
                        }
                    });
                });
            });
            //let errors = _.findKeyInObj(form.$error, '$setTouched');
            return false;
        }
        return true;
    }
}