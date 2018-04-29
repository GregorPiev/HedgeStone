/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import dropDownMenu from '../drop-down-menu/drop-down-menu.drv';

import './tab.less';

export default angular.module('header.menu.tab', [dropDownMenu.name])
    .directive('tab', tabConfig);

function tabConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./tab.tpl.html'),
        controller: tabController,
        controllerAs: 'tab'
    }
}

class tabController {
    constructor($scope, $state, $window) {
        this.tabData = $scope.data;
        this.dropDownOpening = false;
        this.$state = $state;
        this.$window = $window;
    }

    openMenu() {
        this.dropDownOpening = true;
    }

    closeMenu() {
        this.dropDownOpening = false;
    }

    isActive() {
        return this.tabData.ref === this.$state.current.name;
    }

    goTo() {
        if(this.tabData.ref)
            this.$state.go(this.tabData.ref);
        if(this.tabData.link)
            this.$window.open(this.tabData.link);
    }
}