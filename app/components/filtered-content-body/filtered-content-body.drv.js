import './filtered-content-body.less';
import 'angular-truncate-2';

// TODO: add truncate filter. optional: https://github.com/sparkalow/angular-truncate

export default angular.module('page.section.filteredContentBody', ['truncate'])
    .directive('filteredContentBody', filteredContentBodyConfig);

function filteredContentBodyConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./filtered-content-body.tpl.html'),
        controller: filteredContentBodyController,
        controllerAs: 'filteredContentBody'
    }
}


class filteredContentBodyController {
    constructor($scope) {
        this.contentBodyData = $scope.data;
    }
}