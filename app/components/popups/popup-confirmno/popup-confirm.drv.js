/**
 * Created by saar on 02/05/16.
 */

import './popup-confirmno.less';

export default angular.module('app.popups.confirmno', [])
    .directive('popupConfirmno', popupConfirmnoConfig);


function popupConfirmnoConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '=',
            no: '=',
            yes: '='
        },
        template: require('./popup-confirmno.tpl.html'),
        controller: popupConfirmnoController,
        controllerAs: 'popupConfirmno'
    }
}

class popupConfirmnoController {
    constructor($scope, popupsService, $state) {
        this.$state = $state;
        this.popupsService = popupsService;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;
        this.no = $scope.no;
        this.yes = $scope.yes;
        //this.popupData = $scope.data;
        this.popupData = require('./popup-confirmno.json');
        this.removecancel = true;
    }
}

