/*
 Created by bnaya on 28/01/16,
 @Component Name: page.drv
 @Description:
 @Params:
 @Return:
 @Methods:
 */

import './login-form.less';

export default angular.module('app.page.section.loginForm', [])
        .directive('loginForm', loginFormConfig);

function loginFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./login-form.tpl.html'),
        controller: loginFormController,
        controllerAs: 'loginForm'
    }
}

class loginFormController {
    constructor($scope, popupsService, $stateParams, authService, $timeout, Analytics, $log, Upload, domFactory, localStorageService) {
        this.$scope = $scope;

        this.loginFormData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.loginFormData, 'loginForm', 'loginFormData');
        this.popupsService = popupsService;
        this.$stateParams = $stateParams;
        this.authService = authService;
        this.localStorageService = localStorageService;
        this.$timeout = $timeout;
        if ($stateParams.email && $stateParams.password) {
            let fields = _.findKeyInObj(this.loginFormData, "element");
            angular.forEach(fields, (value, key) => {
                value.dynamicAttrs['ng-model'] = _.find(value, {name: "user_name"}) ? $stateParams.email :
                        _.find(value, {name : "password"}) ? $stateParams.password : "";
            });
            // this.loginFormData.form.groups[0].filed.model = $stateParams.email;
            // this.loginFormData.form.groups[1].filed.model = $stateParams.password;
            this.autoLogin();
        }
        this.submitting();
    }

    submitting() {
        let formId = this.loginFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {
            
            this.submit(formData);
        })
    }

    submit(form) {
        let isAutoLogin = this.$stateParams.email && this.$stateParams.password;
        let formData = {}; // object for collecting the data.
        let that = this;
        angular.forEach(form, (value, key) => { // go over the DOM and collect the data from the elements
            if (typeof value.dynamicAttrs['ng-model'] !== 'undefined')
                formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
        });

        this.authService.logging(formData, this.$stateParams.extRedir, isAutoLogin).then((response) => {
            
        }).catch((response) => {
           
        });
    }

    autoLogin() {
        this.$timeout(() => $('.submitBtn')[0].click(), 0);
    }
}