/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description: Credit cards icons in the footer
 @Params: 
 @Return: 
 @Methods: 
*/

import './credit-cards.less';

export default angular.module('app.footer.creditCards', [])
    .directive('creditCards', creditCardsConfig);

function creditCardsConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./credit-cards.tpl.html'),
        controller: creditCardsController,
        controllerAs: 'creditCards'
    }
}

class creditCardsController {
    constructor($scope) {
        this.creditCardsData = $scope.data;
    }
}