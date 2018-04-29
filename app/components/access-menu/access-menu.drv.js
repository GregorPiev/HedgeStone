/*
 Created by bnaya on 28/01/16, 
 @Component Name: access-menu.drv
 @Description: Horizontal menu
 @Params: 
 @Return: 
 @Methods: 
*/

import './access-menu.less';

export default angular.module('app.header.accessMenu', [])
    .directive('accessMenu', accessMenuConfig);

function accessMenuConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./access-menu.tpl.html'),
        controller: accessMenuController,
        controllerAs: 'accessMenu'
    }
}

class accessMenuController {
    constructor($scope, domFactory) {
        this.accessMenuData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.accessMenuData, 'accessMenu', 'accessMenuData');
    }
}