/**
 * Created by saar on 02/05/16.
 */

export default angular.module('app.popups.success.amountCurrency', [])
    .directive('popupAmountCurrency', popupAmountCurrencyConfig);


function popupAmountCurrencyConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '='
        },
        template: require('./popup-success.tpl.html'),
        controller: PopupAmountCurrencyController,
        controllerAs: 'popupAmountCurrency'
    }
}

class PopupAmountCurrencyController {
    constructor($scope, popupsService) {
        //this.popupData = $scope.data;
        this.popupsService = popupsService;
        $scope.$watch(() => {
            return this.popupsService.depositAmount;
        }, (newVal) => {
            if (typeof newVal !== 'undefined') {
                this.depositAmount = this.popupsService.depositAmount;
                this.depositCurrency = this.popupsService.depositCurrency;
            }
        });
    }
}

