/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description: Display text
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';
import './content-body.less';

export default angular.module('page.section.contentBody', [])
    .directive('contentBody', contentBodyConfig);

function contentBodyConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./content-body.tpl.html'),
        controller: contentBodyController,
        controllerAs: 'contentBody'
    }
}


class contentBodyController {
    constructor($scope) {
        this.contentBodyData = $scope.data;
        //
    }
}