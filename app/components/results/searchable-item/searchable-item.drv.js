/**
 * Created by saar on 21/04/16.
 */

import './searchable-item.less';

export default angular.module('app.pages.searchable', [])
    .directive('searchableItem', searchableItemConfig);

function searchableItemConfig () {
    return {
        restrict: 'A',
        replace: true,
        controller: searchableItemController,
        controllerAs: 'searchableItem'
    }
}

class searchableItemController {
    constructor($scope) {
       this.$scope = $scope;

        $scope.$on('search', () => {
        });
    }
}