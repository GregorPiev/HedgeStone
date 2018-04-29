/**
 * Created by saar on 07/07/16.
 */

import './read-more.less';

export default angular.module('page.section.read_more', [])
    .directive('readMore', readMoreConfig);

function readMoreConfig() {
    return {
        restrict: 'E',
        replace: true,
        template: require('./read-more.tpl.html'),
        scope: {
            data: '='
        },
        controller: readMoreController,
        controllerAs: 'readMore'
    }
}


class readMoreController {
    constructor($rootScope, $scope) {
        let _this=this;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.showReadMore = true;

        this.btn = {
            title: 'read more',
            class: 'btn btn-transparent'
        }
        
        this.$rootScope.$on('hideReadMore',function(event,data){
            _this.showReadMore = data;
        });

    }

    showMore() {
        this.$rootScope.$broadcast('readMore', 8);
    }
}
