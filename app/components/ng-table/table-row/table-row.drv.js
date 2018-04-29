/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './table-row.less';

export default angular.module('app.page.section.ngTable.tableRow', [])
    .directive('tableRow', tableRowConfig);

function tableRowConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./table-row.tpl.html'),
        controller: tableRowController,
        controllerAs: 'tableRow'
    }
}

class tableRowController {
    constructor($scope, domFactory) {
        this.tableRowData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.tableRowData, 'tableRow', 'tableRowData');
    }
}