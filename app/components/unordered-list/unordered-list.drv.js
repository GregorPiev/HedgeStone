/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './unordered-list.less';

export default angular.module('app.page.section.unorderedList', [])
    .directive('unorderedList', unorderedListConfig);

function unorderedListConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./unordered-list.tpl.html'),
        controller: unorderedListController,
        controllerAs: 'unorderedList'
    }
}

class unorderedListController {
    constructor($scope, domFactory) {
        this.unorderedListData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.unorderedListData, 'unorderedList', 'unorderedListData');
    }
}