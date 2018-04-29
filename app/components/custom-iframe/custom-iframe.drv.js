/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './custom-iframe.less';

export default angular.module('app.page.customIframe', [])
    .directive('customIframe', autoSubmitConfig);

function autoSubmitConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./custom-iframe.tpl.html'),
        controller: autoSubmitController,
        controllerAs: 'customIframe'
    }
}

class autoSubmitController {
    constructor($scope) {
        let self = this;
        self.html = "";
        $scope.$on('iframe', function(event, data) {
            self.html = `<iframe src="${data}"></iframe>`;
        });
    }
}