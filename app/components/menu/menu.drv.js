/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import tab from '../tab/tab.drv';

import './menu.less';

export default angular.module('app.header.menu', [tab.name])
    .directive('menu', menuConfig);

function menuConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./menu.tpl.html'),
        controller: menuController,
        controllerAs: 'menu'
    }
}

class menuController {
    constructor($scope) {
        this.menuData = $scope.data;
    }
}