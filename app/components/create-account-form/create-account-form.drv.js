/*
 Created by bnaya on 28/01/16, 
 @Component Name: create-account-form.drv
 @Description: Form to register a new user to the site.
 @Params: 
 @Return: 
 @Methods: 
*/

import './create-account-form.less';

export default angular.module('app.page.section.createAccountForm', [])
    .directive('createAccountForm', createAccountFormConfig);

function createAccountFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./create-account-form.tpl.html'),
        controller: createAccountFormController,
        controllerAs: 'createAccountForm'
    }
}

class createAccountFormController {
    constructor($scope, $timeout, loadingFrameService, localStorageService, popupsService, authService, $state, domFactory) {
        this.createAccountFormData = $scope.data;        
        $timeout(() => {
            $('[name*=FirstName]').focus();
        }, 0);

        this.html = "";
        this.html = domFactory.generateArray(this.createAccountFormData, 'createAccountForm', 'createAccountFormData');        

        this.$scope = $scope;
        this.loadingFrameService = loadingFrameService;
        this.localStorageService = localStorageService;
        this.authService = authService;
        this.popupsService = popupsService;
        this.$state = $state;

        this.submitting();
    }

    submitting() {
        let formId = this.createAccountFormData.array[0]['new-form'].id;        
        $("select[name='currency'] option[value='GBP']").attr('selected','selected');
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {            
            this.submit(formData);
        });
    }

    /**
     * @Description: Submitting the form with the filled data.
     * @param form
     */
    submit(form) {
        let formData = {}; // object for collecting the data.

        angular.forEach(form, (value, key) => { // go over the DOM and collect the data from the elements
            if(value.element === 'select')
                formData[value.attrs.name] = value.dynamicAttrs['ng-model'].id;
            else if(value.element === 'ui-select-wrapper')
                formData[value.attrs.name] = value.selected.code;
            else if(typeof value.dynamicAttrs['ng-model'] !== 'undefined')
                formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
        });

        // check if the user is related to a campaign
        if(typeof this.localStorageService.get('utm_campaign') !== 'undefined' || this.localStorageService.get('utm_campaign')!==null){
            formData.campaignId = this.localStorageService.get('utm_campaign');
        
        }else if(typeof this.localStorageService.get('campaignId') !== 'undefined' || this.localStorageService.get('campaignId')!==null){
            formData.campaignId = this.localStorageService.get('campaignId');
        }else{
            formData.campaignId =null;
        }
        
        if(typeof this.localStorageService.get('subCampaign') !== 'undefined')
            formData.subCampaign = this.localStorageService.get('subCampaign');

        formData.birthday = `${formData.Year}-${formData.Month}-${formData.Day}`;
        formData.skype = `test`;        
        let success = (response) => {
            this.$state.go('login');
        }

        this.authService.registering(formData).then(success);
    }
}