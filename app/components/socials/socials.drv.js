/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './socials.less';

export default angular.module('app.footer.socials', [])
    .directive('socials', socialsConfig);

function socialsConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./socials.tpl.html'),
        controller: socialsController,
        controllerAs: 'socials'
    }
}

class socialsController {
    constructor($scope) {
        this.socialsData = $scope.data;
    }
}