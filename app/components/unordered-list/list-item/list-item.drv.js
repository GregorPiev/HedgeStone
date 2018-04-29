/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import './list-item.less';

export default angular.module('app.page.section.listItem', [])
    .directive('listItem', listItemConfig);

function listItemConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./list-item.tpl.html'),
        controller: listItemController,
        controllerAs: 'listItem'
    }
}

class listItemController {
    constructor($scope, domFactory) {
        this.listItemData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.listItemData, 'listItem', 'listItemData');
    }
    
    iconExist() {
        return typeof this.listItemData.icon !== 'undefined';
    }
}