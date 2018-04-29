/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './sub-tab.less';

export default angular.module('header.menu.tab.subTab', [])
    .directive('subTab', subTabConfig);

function subTabConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./sub-tab.tpl.html'),
        controller: subTabController,
        controllerAs: 'subTab'
    }
}

class subTabController {
    constructor($scope) {
        this.subTabData = $scope.data;
    }
}