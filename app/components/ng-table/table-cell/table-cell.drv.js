/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './table-cell.less';

export default angular.module('app.page.section.ngTable.tableCell', [])
    .directive('tableCell', tableCellConfig);

function tableCellConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./table-cell.tpl.html'),
        controller: tableCellController,
        controllerAs: 'tableCell'
    }
}

class tableCellController {
    constructor($scope, domFactory) {
        this.tableCellData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.tableCellData, 'tableCell', 'tableCellData');
        // if(typeof this.tableCellData.array !== 'undefined' || !_.isEmpty(this.tableCellData.array)) {
        //     if(typeof this.tableCellData.array[0].precedence !== 'undefined')
        //         this.tableCellData.array.sort(function(a, b){return a.precedence-b.precedence});
        //     angular.forEach(this.tableCellData.array, (value, key)=> {
        //         let component = Object.keys(value)[0];
        //         this.html += "<"+component+" data=\"tableCell.tableCellData.array["+key+"]['"+component+"']\"></"+component+">";
        //     });
        // }
        if(typeof this.tableCellData.body !== 'undefined' || !_.isEmpty(this.tableCellData.body)) {
            angular.forEach(this.tableCellData.body, (value, key)=> {
                this.html += "<"+key+" data=\"tableCell.tableCellData.body['"+key+"']\"></"+key+">";
            });
        }
    }
}