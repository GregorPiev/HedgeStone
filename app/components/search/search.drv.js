/**
 * Created by saar on 21/04/16.
 */

import './search.less';

export default angular.module('app.page.search', [])
    .directive('search', searchConfig);

function searchConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./search.tpl.html'),
        controller: searchController,
        controllerAs: 'search'
    }
}

class searchController {
    constructor($scope, $rootScope) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.data = $scope.data;
        
    }

    submitSearch () {        
        this.$rootScope.$broadcast('search', this.searchQuery);
    }


}