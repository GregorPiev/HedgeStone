/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import subTab from './sub-tab/sub-tab.drv';

import './drop-down-menu.less';

export default angular.module('header.menu.tab.dropDownMenu', [subTab.name])
    .directive('dropDownMenu', dropDownMenuConfig);

function dropDownMenuConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=',
            dropDownOpening: '='
        },
        bindToController: true,
        template: require('./drop-down-menu.tpl.html'),
        controller: dropDownMenuController,
        controllerAs: 'dropDownMenu'
    }
}

class dropDownMenuController {
    constructor($scope) {
        this.dropDownMenuData = $scope.data;
    }
}