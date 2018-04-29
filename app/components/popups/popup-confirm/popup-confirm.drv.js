/**
 * Created by saar on 02/05/16.
 */

import './popup-confirm.less';

export default angular.module('app.popups.confirm', [])
    .directive('popupConfirm', popupConfirmConfig);


function popupConfirmConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '=',
            no: '=',
            yes: '='
        },
        template: require('./popup-confirm.tpl.html'),
        controller: popupConfirmController,
        controllerAs: 'popupConfirm'
    }
}

class popupConfirmController {
    constructor($scope, popupsService, $state) {
        this.$state = $state;
        this.popupsService = popupsService;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;
        this.no = $scope.no;
        this.yes = $scope.yes;
        //this.popupData = $scope.data;
        this.popupData = require('./popup-confirm.json');
        this.removecancel = true;
    }
}

