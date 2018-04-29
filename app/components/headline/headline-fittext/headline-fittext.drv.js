/**
 * Created by saar on 26/06/16.
 */

import 'ng-fittext';

export default angular.module('app.page.section.headline.fittext', ['ngFitText'])
    .directive('headlineFittext', headlineFitTextConfig);

function headlineFitTextConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./headline-fittext.tpl.html'),
        controller: headlineFitTextController,
        controllerAs: 'headlineFitText'
    }
}

class headlineFitTextController {
    constructor($scope) {
        this.headlineFitTextData = $scope.data;
    }
}