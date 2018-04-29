/*
 Created by bnaya on 28/01/16, 
 @Component Name: headline.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './headline.less';

export default angular.module('page.section.headline', [])
    .directive('headline', headlineConfig);

function headlineConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./headline.tpl.html'),
        controller: headlineController,
        controllerAs: 'headline'
    }
}


class headlineController {
    constructor($scope) {
        this.headlineData = $scope.data;
    }
}