/**
 * Created by saar on 02/05/16.
 */

import './popup-trade-block.less';

export default angular.module('app.popups.tradeBlock', [])
    .directive('popupTradeBlock', popupTermsConfig);


function popupTermsConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '=',
            no: '=',
            yes: '='
        },
        template: require('./popup-trade-block.tpl.html'),
        controller: popupTermsController,
        controllerAs: 'popupTradeBlock'
    }
}

class popupTermsController {
    constructor($scope, popupsService, $state, userService) {
        this.$state = $state;
        this.popupsService = popupsService;
        this.userService = userService;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;
        this.no = $scope.no;
        this.yes = $scope.yes;
        //this.popupData = $scope.data;
        this.popupData = require('./popup-trade-block.json');
    }
}

