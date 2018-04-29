/**
 * Created by saar on 02/05/16.
 */

import './popup-simple.less';

export default angular.module('app.popups.simple', [])
    .directive('popupSimple', popupSimpleConfig);


function popupSimpleConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '='
        },
        template: require('./popup-simple.tpl.html'),
        controller: popupSimpleController,
        controllerAs: 'popupSimple'
    }
}

class popupSimpleController {
    constructor($scope, popupsService, $state, userService) {        
        //this.popupData = $scope.data;
        this.popupsService = popupsService;
        this.$state = $state;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;
        this.prePopupData = require('./popup-simple.json');
        this.prePopupData.img.src = this.prePopupData.img.src.replace('<countrycode>', userService.userData.geoData.countryCode[0]);
        this.prePopupData.content.text = this.prePopupData.content.text.replace('<country>', userService.userData.geoData.countryName[0]);
        this.popupData = this.prePopupData;
    }
}

