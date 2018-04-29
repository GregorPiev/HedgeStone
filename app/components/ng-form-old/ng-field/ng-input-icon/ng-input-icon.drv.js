/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngInputIcon.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import './ng-input-icon.less';

export default angular.module('ngInputIcon', [])
    .directive('ngInputIcon', ngInputIconConfig);

function ngInputIconConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            inputIconData: '='
        },
        template: require('./ng-input-icon.tpl.html'),
        controller: NgInputIconController,
        controllerAs: 'ngInputIcon'
    }
}

class NgInputIconController {
    constructor($scope) {
        this.inputIcon = $scope.inputIconData;
    }
}