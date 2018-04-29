/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';
import tableRow from './table-row/table-row.drv';
import tableCell from './table-cell/table-cell.drv';

import './ng-table.less';

export default angular.module('app.page.section.ngTable', [tableRow.name, tableCell.name])
    .directive('ngTable', ngTableConfig);

function ngTableConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ng-table.tpl.html'),
        controller: ngTableController,
        controllerAs: 'ngTable'
    }
}

class ngTableController {
    constructor($scope, domFactory) {
        this.ngTableData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.ngTableData, 'ngTable', 'ngTableData');
        // if(typeof this.ngTableData.array !== 'undefined' || !_.isEmpty(this.ngTableData.array)) {
        //     if(typeof this.ngTableData.array[0].precedence !== 'undefined')
        //         this.ngTableData.array.sort(function(a, b){return a.precedence-b.precedence});
        //     angular.forEach(this.ngTableData.array, (value, key)=> {
        //         let component = Object.keys(value)[0];
        //         this.html += "<"+component+" data=\"ngTable.ngTableData.array["+key+"]['"+component+"']\"></"+component+">";
        //     });
        // }
        if(typeof this.ngTableData.body !== 'undefined' || !_.isEmpty(this.ngTableData.body)) {
            angular.forEach(this.ngTableData.body, (value, key)=> {
                this.html += "<"+key+" data=\"ngTable.ngTableData.body['"+key+"']\"></"+key+">";
            });
        }
    }
}