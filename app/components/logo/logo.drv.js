/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './logo.less';

export default angular.module('app.header.logo', [])
    .directive('logo', logoConfig);

function logoConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./logo.tpl.html'),
        controller: logoController,
        controllerAs: 'logo'
    }
}

class logoController {
    constructor($scope) {
        this.logoData = $scope.data;
    }
}