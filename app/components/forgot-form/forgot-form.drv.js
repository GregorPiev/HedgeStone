/*
 Created by bnaya on 28/01/16, 
 @Component Name: forgot-form.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import './forgot-form.less';

export default angular.module('app.page.section.forgotForm', [])
    .directive('forgotForm', forgotFormConfig);

function forgotFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./forgot-form.tpl.html'),
        controller: forgotFormController,
        controllerAs: 'forgotForm'
    }
}

class forgotFormController {
    constructor($scope, domFactory, authService, popupsService, $state, userService) {
        this.forgotFormData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.forgotFormData, 'forgotForm', 'forgotFormData');
        

        this.$scope = $scope;
        this.authService = authService;
        this.popupsService = popupsService;
        this.$state = $state;
        this.userService = userService;
        this.submitting();
    }

    submitting() {
        let formId = this.forgotFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {
            
            this.submit(formData);
        })
    }

    /**
     * @Description: Send a forgot password email to the user
     * @param form
     */
    submit(form) {
        let formData = {}; // object for collecting the data.
        angular.forEach(form, (value, key) => { // go over the DOM and collect the data from the elements
            if(typeof value.dynamicAttrs['ng-model'] !== 'undefined')
                formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
        });

        let success = (response) => {
            this.userService.userData.resetPassword = {
                email: formData.email
            };
            this.$state.go('verify_token');
        };

        let params = {
            email: formData.email
        };

        this.authService.resetPasswordByEmail(params).then(success);
    }
}