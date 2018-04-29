/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './card.less';
import cardIcon from './card-icon/card-icon.drv';
import comingSoon from './coming-soon/coming-soon.drv';

export default angular.module('page.section.card', [cardIcon.name, comingSoon.name])
    .directive('card', cardConfig);

function cardConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./card.tpl.html'),
        controller: cardController,
        controllerAs: 'card'
    }
}

class cardController {
    constructor($scope, domFactory) {
        this.cardData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.cardData, 'card', 'cardData');
    }
}