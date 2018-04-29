/**
 * Created by saar on 18/08/16.
 */

import './captcha.less';

export default angular.module('app.newForm.formGroup.ngField.captcha', [])
    .directive('captcha', captchaConfig);

function captchaConfig() {
    return {
        restrict: 'E',
        replace: true,
        template: require('./captcha.tpl.html'),
        controller: captchaController,
        controllerAs: 'captcha'
    }
}

class captchaController {
    constructor($scope) {
        this.$scope = $scope;
    }

    setResponse(response) {
        this.$scope.$broadcast(`captchaClearGenericValid`);
    }
}