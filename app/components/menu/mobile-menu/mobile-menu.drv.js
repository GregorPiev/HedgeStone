import tab from '../../tab/tab.drv';

import './mobile-menu.less';

export default angular.module('app.header.menu.mobile', [tab.name])
    .directive('mobileMenu', mobileMenuConfig);

function mobileMenuConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./mobile-menu.tpl.html'),
        controller: mobileMenuController,
        controllerAs: 'mobileMenu'
    }
}

class mobileMenuController {
    constructor($scope) {
        this.mobileMenuData = $scope.data;
        this.isCollapsed = true;

        $scope.$on('$stateChangeStart', () => {
            this.isCollapsed = true;
        });

        this.closeThis = () => {
            this.isCollapsed = true;
        }
    }
}