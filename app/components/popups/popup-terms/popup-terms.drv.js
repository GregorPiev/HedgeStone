/**
 * Created by saar on 02/05/16.
 */

import './popup-terms.less';

export default angular.module('app.popups.terms', [])
    .directive('popupTerms', popupTermsConfig);


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
        template: require('./popup-terms.tpl.html'),
        controller: popupTermsController,
        controllerAs: 'popupTerms'
    }
}

class popupTermsController {
    constructor($scope, popupsService, $state) {
        this.$state = $state;
        this.popupsService = popupsService;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;
        this.no = $scope.no;
        this.yes = $scope.yes;
        //this.popupData = $scope.data;
        this.popupData = require('./popup-terms.json');
    }
}

