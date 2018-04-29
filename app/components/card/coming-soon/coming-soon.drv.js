/*
 Created by bnaya on 28/01/16, 
 @Component Name: coming-soon.drv
 @Description: Add coming soon cloak to an item
 @Params: 
 @Return: 
 @Methods: 
*/

import './coming-soon.less';

export default angular.module('page.section.card.comingSoon', [])
    .directive('comingSoon', comingSoonConfig);

function comingSoonConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./coming-soon.tpl.html'),
        controller: comingSoonController,
        controllerAs: 'comingSoon'
    }
}

class comingSoonController {
    constructor($scope, domFactory) {
        this.comingSoonData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.comingSoonData, 'comingSoon', 'comingSoonData');
    }
}