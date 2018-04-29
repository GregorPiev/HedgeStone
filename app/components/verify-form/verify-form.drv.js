/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import './verify-form.less';

export default angular.module('app.page.section.verifyForm', [])
    .directive('verifyForm', verifyFormConfig);

function verifyFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./verify-form.tpl.html'),
        controller: verifyFormController,
        controllerAs: 'verifyForm'
    }
}

class verifyFormController {
    constructor($scope, $location, $timeout, userService, domFactory, authService, $state, popupsService) {
        this.verifyFormData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.verifyFormData, 'verifyForm', 'verifyFormData');        
        if(typeof $location.$$search.token !== 'undefined') {
            userService.userData.resetPassword.email = $location.$$search.email;
            _.findKeyInObj(this.verifyFormData, 'element')[0].dynamicAttrs['ng-model'] = $location.$$search.token;
            $timeout(() => $('button.submitBtn').click(), 0);
        }


        this.$scope = $scope;
        this.authService = authService;
        this.userService = userService;
        this.$state = $state;
        this.popupsService = popupsService;
        this.submitting();
    }

    submitting() {
        let formId = this.verifyFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {           
            this.submit(formData);
        })
    }

    submit(form) {
        let formData = {}; // object for collecting the data.
        angular.forEach(form, (value, key) => { // go over the DOM and collect the data from the elements
            if(typeof value.dynamicAttrs['ng-model'] !== 'undefined')
                formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
        });

        formData.email = this.userService.userData.resetPassword.email;

        let success = (response) => {
            this.userService.userData.resetPassword.token = formData.token;
            this.$state.go('reset_password');
        };

        this.authService.verifyToken(formData).then(success);
    }
}