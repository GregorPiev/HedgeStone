/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngMsgBox.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import './ng-msg-box.less';

export default angular.module('ngMsgBox', [])
    .directive('ngMsgBox', ngMsgBoxConfig);

function ngMsgBoxConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            formData: '=',
            fieldData: '='
        },
        template: require('./ng-msg-box.tpl.html'),
        controller: NgMsgBoxController,
        controllerAs: 'ngMsgBox'
    }
}

class NgMsgBoxController {
    constructor($scope, $rootScope) {
        this.field = $scope.fieldData;        
        $rootScope.$on(this.field.attrs.name + 'IsReady', ()=> {
            this.form = $scope.formData;
        });
    }
}