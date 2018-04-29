/**
 * Created by saar on 02/05/16.
 */

import popup from './popup/popup.drv';
import success from './popup-success/popup-success.drv';
import tradeBlock from './popup-trade-block/popup-trade-block.drv';

import './popups.less';

export default angular.module('app.popups', [popup.name, success.name, tradeBlock.name])
    .directive('popups', popupsConfig);


function popupsConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        template: require('./popups.tpl.html'),
        controller: popupsController,
        controllerAs: 'popups'
    }
}

class popupsController {
    constructor($scope, popupsService) {
        this.popupsService = popupsService;
        this.html = '';
        $scope.$on('popups', () => {
            this.popupOn = this.popupsService.popupOn;
            if(this.popupOn) {
                this.html = this.popupsService.htmlArray[0];
                this.currentData = this.popupsService.currentDataArray[0];
                this.defaultData = this.popupsService.defaultData;
            } else {
                this.html = '';
                this.currentData = [];
                this.defaultData = [];
            }
        });

        $scope.$on('popupClosed', () => {
            this.html = '';
        });
    }
}

