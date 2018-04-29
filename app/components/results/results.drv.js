/**
 * Created by saar on 21/04/16.
 */

import './results.less';

export default angular.module('app.page.results', [])
    .directive('results', resultsConfig);

function resultsConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./results.tpl.html'),
        controller: resultsController,
        controllerAs: 'results'
    }
}

class resultsController {
    constructor($scope) {
        this.resultsData = $scope.data;        
        this.html = "";

    }
}