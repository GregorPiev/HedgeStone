/*
 Created by bnaya on 28/01/16,
 @Component Name: page.drv
 @Description:
 @Params:
 @Return:
 @Methods:
 */
//import ngField from 'ng-field/ng-field.drv';

import './tab-btn.less';

export default angular.module('app.page.section.tabSet.tabBtn', [])
    .directive('tabBtn', tabBtnConfig);

function tabBtnConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=',
            index: '@index'
        },
        template: require('./tab-btn.tpl.html'),
        controller: tabBtnController,
        controllerAs: 'tabBtn'
    }
}

class tabBtnController {
    constructor($scope, $rootScope, $stateParams, $state) {
        this.tabBtnData = $scope.data;
        this.tabBtnData.index = $scope.index;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$scope = $scope;
        $scope.$on('tabBtn', (event, data) => {
            if(_.includes(data.hashes, this.tabBtnData.index)) {
                this.tabBtnData.show = (this.tabBtnData.index === data.id);
            }
        });
    }

    switch() {
        if (!this.isDisabled()) {            
            let params = {id: this.tabBtnData.id, title: this.tabBtnData.title};
            this.$scope.$emit('switchTab', params);            
        }
    }


    currentTab() {
        return this.tabBtnData.index === this.currentTabId;
    }

    iconExist() {
        if (typeof this.tabBtnData.icon !== 'undefined') // maybe add to comparison type of icons?
            return true;
        return false;
    }

    isDisabled() {
        return this.tabBtnData.disabled;
    }
}
