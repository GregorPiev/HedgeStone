/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngFormSubmit.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import "./ng-form-submit.less";

export default angular.module('ngSubmit', [])
    .directive('ngFormSubmit', ngFormSubmitConfig);

function ngFormSubmitConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ng-form-submit.tpl.html'),
        controller: NgSubmitController,
        controllerAs: 'ngFormSubmit'
    }
}

class NgSubmitController {
    constructor($scope) {
        this.btn = $scope.data;
        this.$scope = $scope;
    }

    isDefined(value) {
        if(typeof value !== 'undefined')
            return true;
        return false;
    }
}