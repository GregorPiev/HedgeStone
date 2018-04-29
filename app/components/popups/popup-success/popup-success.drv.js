/**
 * Created by saar on 02/05/16.
 */

import './popup-success.less';
import popupAmountCurrency from './popup-amount-currency/popup-amount-currency.drv';

export default angular.module('app.popups.success', [popupAmountCurrency.name])
    .directive('popupSuccess', popupSuccessConfig);


function popupSuccessConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '='
        },
        template: require('./popup-success.tpl.html'),
        controller: popupSuccessController,
        controllerAs: 'popupSuccess'
    }
}

class popupSuccessController {
    constructor($scope, popupsService, $state) {
        //this.popupData = $scope.data;
        this.popupsService = popupsService;
        this.$state = $state;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;
        this.prePopupData = require('./popup-success.json');
        this.prePopupData.content.text = this.prePopupData.content.text.replace('Amount', popupsService.depositAmount);
        this.prePopupData.content.text = this.prePopupData.content.text.replace('Currency', popupsService.depositCurrency);
        this.popupData = this.prePopupData;
    }
}

