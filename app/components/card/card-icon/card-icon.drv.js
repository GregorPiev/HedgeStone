/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './card-icon.less';

export default angular.module('page.section.card.cardIcon', [])
    .directive('cardIcon', cardIconConfig);

function cardIconConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./card-icon.tpl.html'),
        controller: cardIconController,
        controllerAs: 'cardIcon'
    }
}

class cardIconController {
    constructor($scope) {
        this.cardIconData = $scope.data;
        this.html = "";
        if(typeof this.cardIconData.array !== 'undefined' || !_.isEmpty(this.cardIconData.array)) {
            if(typeof this.cardIconData.array[0].precedence !== 'undefined')
                this.cardIconData.array.sort(function(a, b){return a.precedence-b.precedence});
            angular.forEach(this.cardIconData.array, (value, key)=> {
                let component = Object.keys(value)[0];
                this.html += "<"+component+" data=\"cardIcon.cardIconData.array["+key+"]['"+component+"']\"></"+component+">";
            });
        }
        if(typeof this.cardIconData.body !== 'undefined' || !_.isEmpty(this.cardIconData.body)) {
            angular.forEach(this.cardIconData.body, (value, key)=> {
                this.html += "<"+key+" data=\"cardIcon.cardIconData.body['"+key+"']\"></"+key+">";
            });
        }
    }
}