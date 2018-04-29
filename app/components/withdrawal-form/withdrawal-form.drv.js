/**
 * Created by saar on 29/06/16.
 * Withdrawal form - fill the amount you want and make a withdrawal
 */
import currencyList from  '../../../assets/jsons/currency.json'
import './withdrawal-form.less';

export default angular.module('app.page.section.withdrawalForm', [])
    .directive('withdrawalForm', withdrawalFormConfig);

/**
 * The directive's configuration
 * @returns {{restrict: string, replace: boolean, scope: {data: string}, template: *, controller: withdrawalFormController, controllerAs: string}}
 */
function withdrawalFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./withdrawal-form.tpl.html'),
        controller: withdrawalFormController,
        controllerAs: 'withdrawalForm'
    }
}

/**
 * withdrawalFormController
 * Initiate the form varibales: account balance for maximum withfrawal and minimum amount for withdrawal
 */
class withdrawalFormController {
    constructor($scope, userService, domFactory, withdrawalService, popupsService) {
        this.withdrawalFormData = $scope.data;
        this.$scope = $scope;
        this.userService = userService;
        this.withdrawalService = withdrawalService;
        this.popupsService = popupsService;
        let symbol;
        this.html = "";

        let minErrMsg = _.findKeyInObj(this.withdrawalFormData, 'min');        
        this.html = domFactory.generateArray(this.withdrawalFormData, 'withdrawalForm', 'withdrawalFormData');

        this.userService.updateAccountBalance().then(() => {

            // getting the user's currency
            let currency = _.find(currencyList, {"code": userService.userData.userSession.currency});

            // If the currency was found in the list, take its symbol, otherwise take the currency initials defined by the user
            symbol = currency ? currency.symbol : userService.userData.userSession.currency;


            // defining the maximum amount for withdrawal.
            // this.withdrawalFormData.form.groups[0].filed.max = userService.userData.userSession.accountBalance;
            
            // defining the minimum amount for withdrawal
            this.minimum = `${symbol}10.00`;
            minErrMsg[1].min += this.minimum;

            // the user balance
            this.userBalance = `${symbol}${userService.userData.userSession.accountBalance}`;

        });
        this.submitting();
        this.autoFillFileds();
    }

    autoFillFileds() {
        let fields = _.findKeyInObj(this.withdrawalFormData, "element");
        // Define data from session to form fields.
        angular.forEach(fields, (value, key) => {
            value.attrs.max = _.find(value, {name: "withdrawalAmount"}) ? Math.floor(Number(this.userService.userData.userSession.accountBalance)) : 999999999;
        });
    }

    submitting() {
        let formId = this.withdrawalFormData.array[0]['new-form'].id;        
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {            
            this.submit(formData);
        })
    }

    submit(form) {
        
        // // The amount from the form
        // let amount = this.form.groups[0].filed.model;

        let formData = {}; // object for collecting the data.
        angular.forEach(form, (value, key) => { // go over the DOM and collect the data from the elements
            if(typeof value.dynamicAttrs['ng-model'] !== 'undefined') {
                if(value.attrs.name === 'withdrawalAmount') {
                    formData[value.attrs.name] = Number(value.dynamicAttrs['ng-model']);
                } else {
                    formData[value.attrs.name] = value.dynamicAttrs['ng-model'];
                }
            }
        });
        
        // Ask the withdrawal service to make a withdrawal
        this.withdrawalService.commitWithdrawal(formData).then((response) => {            
            this.popupsService.popItUp({
                type: 'popup',
                settemplate: 'custom',
                headline: 'Success!',
                content: `Your withdrawal request was submitted successfully. A member of our payments processing team will contact you within the next 3 business days with an update regarding the status of your withdrawal. If you have questions about your withdrawal, please contact support by sending an email to <a href="mailto:support@hedgestonegroup.com">support@hedgestonegroup.com</a>.`
            });
        });
        // .catch((error) => {        
        //     this.popupsService.popItUp({
        //         type: 'popup',
        //         settemplate: 'custom',
        //         headline: `We're Sorry`,
        //         content: `Your withdrawal request has failed. If issues persist, please contact support by sending an email to <a href="mailto:support@hedgestonegroup.com">support@hedgestonegroup.com</a>.`
        //     });
        // });
    }
}