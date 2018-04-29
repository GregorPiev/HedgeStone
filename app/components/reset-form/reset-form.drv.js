/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import './reset-form.less';

export default angular.module('app.page.section.resetForm', [])
    .directive('resetForm', resetFormConfig);

function resetFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./reset-form.tpl.html'),
        controller: resetFormController,
        controllerAs: 'resetForm'
    }
}

class resetFormController {
    constructor($scope, userService, authService, domFactory) {
        this.resetFormData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.resetFormData, 'resetForm', 'resetFormData');

        this.$scope = $scope;
        this.userService = userService;
        this.authService = authService;

        this.submitting();
    }

    submitting() {
        let formId = this.resetFormData.array[0]['new-form'].id;
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

        let params = { // Build object with the right properties name.
            email: this.userService.userData.resetPassword.email,
            token: this.userService.userData.resetPassword.token,
            'new_password': formData['new_password']
        };

        let success = (response) => {            
            let params = { // Build object with the right properties name.
                'user_name': this.userService.userData.resetPassword.email,
                'password': formData['new_password']
            };

            return this.authService.logging(params);
        }

        this.authService.newPassword(params).then(success);
    }
}