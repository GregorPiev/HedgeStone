/**
 * Created by saar on 02/05/16.
 */

import './popup-failed-load.less';

export default angular.module('app.popups.failedload', [])
    .directive('popupFailedLoad', popupFailedLoadConfig);


function popupFailedLoadConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '=',
            no: '=',
            yes: '='
        },
        template: require('./popup-failed-load.tpl.html'),
        controller: popupFailedLoadController,
        controllerAs: 'popupFailedLoad'
    }
}

class popupFailedLoadController {
    constructor($scope, popupsService, $state) {
        this.$state = $state;
        this.popupsService = popupsService;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;
        this.no = $scope.no;
        this.yes = $scope.yes;
        //this.popupData = $scope.data;  //
        this.popupData = require('./popup-failed-load.json');        
    }
}

