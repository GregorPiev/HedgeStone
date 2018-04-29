/**
 * Created by bnaya on 14/07/16.
 */

import "./ng-label.less"


export default angular.module('ngLabel', [])
    .directive('ngLabel', ngLabelConfig);

function ngLabelConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ng-label.tpl.html'),
        controller: NgLabelController,
        controllerAs: 'ngLabel'
    }
}

class NgLabelController {
    constructor($scope, domFactory) {
        this.ngLabelData = $scope.data;

        this.html = "";
        this.html = domFactory.generateArray(this.ngLabelData, 'ngLabel', 'ngLabelData');
    }
}