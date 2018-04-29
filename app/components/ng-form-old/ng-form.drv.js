/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngForm.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import ngField from './ng-field/ng-field.drv';
import ngSubmit from './ng-submit/ng-submit.drv';
import ngCheckbox from './ng-checkbox/ng-checkbox.drv';

import './ng-form.less';

export default angular.module('ngForm', [ngField.name, ngSubmit.name, ngCheckbox.name])
    .directive('bnForm', ngFormConfig);

function ngFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            submit: '=',
            formData: '='
        },
        template: require('./ng-form.tpl.html'),
        controller: NgFormController,
        controllerAs: 'ngForm'
    }
}


class NgFormController {
    constructor($rootScope, $scope, authService, userService, $state, depositThreeDService, depositService, popupsService, localStorageService, $stateParams, $window, originService, loadingFrameService, withdrawalService) {
        this.form = $scope.formData;
        this.$stateParams = $stateParams;
        this.submit = _.debounce($scope.submit, 300);
        this.authService = authService;
        this.userService = userService;
        this.originService = originService;
        this.$state = $state;
        this.userService = userService;
        this.depositThreeDService = depositThreeDService;
        this.depositService = depositService;
        this.popupsService = popupsService;
        this.localStorageService = localStorageService;
        this.withdrawalService = withdrawalService;
        this.$window = $window;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.loadingFrameService = loadingFrameService;
    }

    submiting(form) {
        this.submit(form);
    }

    verify(form) {
        if(form.$invalid) {
            angular.forEach(form.$error, (field) => {
                angular.forEach(field, (errorField) => {
                    angular.forEach(errorField.$error, (field) => {
                        angular.forEach(field, (errorField) => {
                            errorField.$setTouched();
                        });
                    });
                });
            });
            return false;
        }
        return true;
    }

    secondBtnExists() {
        return typeof this.form.forgot !== 'undefined';
    }
}