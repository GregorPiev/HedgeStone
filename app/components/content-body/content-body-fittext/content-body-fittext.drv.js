/**
 * Created by saar on 26/06/16.
 */

import './content-body-fittext.less';
import 'ng-fittext';

export default angular.module('page.section.contentBody.fittext', ['ngFitText'])
    .directive('contentBodyFittext', contentBodyFitTextConfig);

function contentBodyFitTextConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./content-body-fittext.tpl.html'),
        controller: contentBodyFitTextController,
        controllerAs: 'contentBodyFitText'
    }
}

class contentBodyFitTextController {
    constructor($scope) {
        this.contentBodyFitTextData = $scope.data;
    }
}