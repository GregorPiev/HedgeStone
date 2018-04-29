/**
 * Created by saar on 02/05/16.
 */

import './popup-generic.less';

export default angular.module('app.popups.generic', [])
    .directive('popupGeneric', popupGenericConfig);


function popupGenericConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '=',
            yes: '=',
            no: '=',
            content: '=',
            headline: '='
        },
        template: require('./popup-generic.tpl.html'),
        controller: popupGenericController,
        controllerAs: 'popupGeneric'
    }
}

class popupGenericController {
    constructor($scope, popupsService, $state) {
        //this.popupData = $scope.data;
        this.popupsService = popupsService;
        this.$state = $state;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;        
        this.yes = $scope.yes;
        this.no = $scope.no;
        this.popupData = require('./popup-generic.json');
        if(typeof $scope.content !== 'undefined') {
            this.popupData.content.text = $scope.content;
        }
        if(typeof $scope.headline !== 'undefined') {
            this.popupData.headline.title = $scope.headline;
        }
    }
}

