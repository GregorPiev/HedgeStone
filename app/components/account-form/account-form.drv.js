/*
 @Component Name: account-form.drv
 @Description: A form to display the client's personal details and allow him to edit them
 @Params:
 @Return:
 @Methods:
 */

import './account-form.less';
import '../../shared/services/countries/countries.srv'

export default angular.module('app.page.section.accountForm', [])
    .directive('accountForm', accountFormConfig);

function accountFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./account-form.tpl.html'),
        controller: accountFormController,
        controllerAs: 'accountForm'
    }
}

class accountFormController {
    constructor($scope, userService, popupsService, loadingFrameService, $timeout, countriesService, domFactory) {
        this.accountFormData = $scope.data;
        this.$scope = $scope;
        this.userService = userService;
        this.popupsService = popupsService;
        this.loadingFrameService = loadingFrameService;
        this.countriesService = countriesService;
        this.loadingFrameService.startLoading();
        this.html = "";
        this.html = domFactory.generateArray(this.accountFormData, 'accountForm', 'accountFormData');

        this.initFields();
        this.submitting();

        $timeout(() => {
            $('[name*=firstName]').focus();
        }, 0);
    }

    /**
     * @Description: Initialize the fields.
     */
    initFields() {
        this.userService.getPersonalUserData().then((response) => { // get the user's details from the session
            let dob = this.userService.userData.userSession.birthday.split("-");
            var formUserData = response.data.message['Account_Settings'];
            this.autoFillFileds(formUserData, dob); // inject each value to the DOM
            this.updateHeadline(formUserData);

            this.loadingFrameService.stopLoading();
        });
    }

    updateHeadline(formUserData) {
        let username = document.getElementById('username');
        if (typeof username !== 'undefined') {
            username.innerHTML = `Hello ${formUserData['First_Name']}!`;
        }
    }

    autoFillFileds(formUserData, dob) {
        let fields = _.findKeyInObj(this.accountFormData, "element");
        // Define data from session to form fields.

        angular.forEach(fields, (value, key) => {
            if (value.element === 'input') {
                value.dynamicAttrs['ng-model'] = _.find(value, {name: "FirstName"}) ? formUserData['First_Name'] :
                    _.find(value, {name: "LastName"}) ? formUserData['Last_Name'] :
                        _.find(value, {name: "City"}) ? formUserData['City'] :
                            _.find(value, {name: "street"}) ? formUserData['Address'] :
                                _.find(value, {name: "postCode"}) ? formUserData['Zip_Code'] :
                                    _.find(value, {name: "email"}) ? formUserData['Email'] :
                                        _.find(value, {name: "phone"}) ? formUserData['Phone'] :
                                            _.find(value, {name: "registrationCountry"}) ? formUserData['Registration_country'] : "";
            }

            else if (value.element === 'select') {
                value.attrs.placeholder = _.find(value, {name: "Year"}) ? dob[0] :
                    _.find(value, {name: "Month"}) ? dob[1] :
                        _.find(value, {name: "Day"}) ? dob[2] : "";
            }

            else if (value.element === 'ui-select-wrapper')
                value.selected = _.find(value, {name: "Country"}) ? _.find(this.countriesService.getCountries(), {name: this.userService.userData.userSession.Country}) : {}; // phone prefix - determined by the user's country.
        });
    }

    submitting() {
        let formId = this.accountFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {
            this.submit(formData);
        })
    }

    /**
     * @Description: submitting the filled form to update the user's details
     * @param form
     */
    submit(form) {
        this.loadingFrameService.startLoading();
        // collecting data
        let formData = {}; // object for collecting the data.
        angular.forEach(form, (value, key) => { // go over the DOM and collect the data from the elements
            if (value.element === 'select')
                formData[value.attrs.name] = value.dynamicAttrs['ng-model'].id;
            else if (value.element === 'ui-select-wrapper')
                formData[value.attrs.name] = value.selected.code;
            else if (typeof value.dynamicAttrs['ng-model'] !== 'undefined')
                formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
        });

        let informationChangeSuccess = (response) => {
            this.popupsService.popItUp({
                type: 'popup',
                settemplate: 'custom',
                headline: "Success!",
                content: "Your Information is updated"
            });
        };

        let informationChangeError = (response) => {
            this.popupsService.popItUp({
                type: 'popup',
                settemplate: 'custom',
                headline: "Failed",
                content: "Failour in updating the information. Please contact our support at <a href='mailto:support@hedgestonegroup.com'>support@hedgestonegroup.com</a>"
            });
        };

        // start password update procedure only if user's entered passwords.
        if (!_.isEmpty(formData['new_password']) && !_.isEmpty(formData.confirmNewPassword)) {
            let params = {
                "new_password": formData['new_password'],
                "email": this.userService.userData.userSession.emailView
            }; // Build object with new password and user email.
            this.userService.updatePersonalUserData(formData).then(() => {
                this.userService.updatePassword(params).then(informationChangeSuccess, informationChangeError);
            });
        } else {
            this.userService.updatePersonalUserData(formData).then(informationChangeSuccess);
        }

    }
}
