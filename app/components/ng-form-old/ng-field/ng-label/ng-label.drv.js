/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngInput.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import './ng-label.less';

export default angular.module('ngLabel', [])
    .directive('ngLabel', ngLabelConfig);
    //.directive('ngLabel', NgLabel);

function ngLabelConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            labelData: '='
        },
        template: require('./ng-label.tpl.html'),
        controller: NgLabelController,
        controllerAs: 'ngLabel'
    }
}

class NgLabelController {
    constructor($scope, $sce) {
        $scope.labelData["title"] = $sce.trustAsHtml($scope.labelData["title"].toString());
        this.label = $scope.labelData;
    }
}