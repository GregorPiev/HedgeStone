/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngSubmit.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import "./ng-submit.less";

export default angular.module('ngSubmit', [])
    .directive('ngSubmit', ngSubmitConfig);

function ngSubmitConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            submitData: '='
        },
        template: require('./ng-submit.tpl.html'),
        controller: NgSubmitController,
        controllerAs: 'ngSubmit'
    }
}

class NgSubmitController {
    constructor($scope) {
        this.btn = $scope.submitData;
    }

    isDefined(value) {
        if(typeof value !== 'undefined')
            return true;
        return false;
    }
}