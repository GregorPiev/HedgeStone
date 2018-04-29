/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import tabArray from '../tab-array/tab-array.drv';

import resolutionCheckerProvider from '../../shared/providers/resolution/resolution.pvdr.js';

import './tabs.less'

export default angular.module('page.section.tabs', [tabArray.name, resolutionCheckerProvider.name])
    .directive('tabs', tabsConfig);

function tabsConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./tabs.tpl.html'),
        controller: tabsController,
        controllerAs: 'tabs'
    }
}

class tabsController {
    constructor($scope, $window, resolutionChecker) {
        this.tabsData = $scope.data;
        this.html = "";
        this.dataArray = [];
        this.html = "";
        this.$window = $window;
        angular.forEach(this.tabsData.parts, (value, key) => {
            this.dataArray[value.precedence] = value;
        });
        angular.forEach(this.dataArray, (value, key) => {
            this.html += "<"+this.tabsData.type+" data=\"tabs.tabsData.parts["+key+"]\"></"+this.tabsData.type+">";
        });
    }
}