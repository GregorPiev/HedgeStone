import './tab-set.less';

import tabBtn from '../tab-btn/tab-btn.drv';
import tabContainer from '../tab-container/tab-container.drv';

export default angular.module('app.page.section.tabSet', [tabBtn.name, tabContainer.name])
    .directive('tabSet', tabSetConfig);


function tabSetConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./tab-set.tpl.html'),
        controller: tabSetController,
        controllerAs: 'tabSet'
    }
}

class tabSetController {
    constructor($scope, $timeout, $rootScope, resolutionChecker, $stateParams, $state) {
        this.tabSetData = $scope.data;
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$scope = $scope;
        this.switchTab();
        this.html = {tabs: "", section: ""};
        if (typeof this.tabSetData.array !== 'undefined' || !_.isEmpty(this.tabSetData.array)) {
            if (typeof this.tabSetData.array[0].precedence !== 'undefined')
                this.tabSetData.array.sort(function (a, b) {
                    return a.precedence - b.precedence
                });
            this.hashes = [];
            angular.forEach(this.tabSetData.array, (value, key)=> {
                let component = Object.keys(value)[0];
                let hash = _.randomHash();
                this.hashes.push(hash);
                this.tabSetData.array[key][component].id = hash;
                this.html.tabs += "<" + component + " class=\"subTab\" data=\"tabSet.tabSetData.array[" + key + "]['" + component + "']\" index=\"" + hash + "\"></" + component + ">";
                angular.forEach(this.tabSetData.array[key][component].array, (valueChild, keyChild) => {
                    let componentChild = Object.keys(valueChild)[0];
                    this.html.section += "<" + componentChild + " index=\"" + hash + "\" data=\"tabSet.tabSetData.array[" + key + "]['" + component + "'].array[" + keyChild + "]['" + componentChild + "']\"></" + componentChild + ">";
                });
            });


            if (resolutionChecker.isMobile()) {
                this.html.tabs = '';
                this.selectedTab = this.tabSetData.array[0]['tab-btn'].title;

                this.changeTab = () => {
                    let selected = _.find(this.tabSetData.array, (val) => val['tab-btn'].title == this.selectedTab);
                    $scope.$broadcast('tabBtn', {id: selected['tab-btn'].id, hashes: this.hashes});
                };

                this.html.section = `<div class="col-xs-12 selectTabs"><select ng-model="tabSet.selectedTab" ng-model-options="{ updateOn: 'default blur', debounce: { 'default': 100, 'blur': 0 }}" ng-change="tabSet.changeTab()" class="form-control"><option ng-repeat="item in tabSet.tabSetData.array" value="{{item['tab-btn'].title}}" ng-disabled="item['tab-btn'].disabled">{{item['tab-btn'].title}}</option></select></div> ${this.html.section}`;
            }

        }

        $timeout(() => {
            if(_.isUndefined(this.$stateParams[this.tabSetData.id]) || _.isEmpty(this.$stateParams[this.tabSetData.id]))
                $scope.$broadcast('tabBtn', {id: this.tabSetData.array[0][Object.keys(this.tabSetData.array[0])[0]].id, hashes: this.hashes});
            else {
                let tab = _.filter(this.tabSetData.array, (o) => {
                    return _.find(o, {title: this.$stateParams[this.tabSetData.id]});
                });
                $scope.$broadcast('tabBtn', {id: tab[0]['tab-btn'].id, hashes: this.hashes});
            }
        }, 0);
    }

    switchTab() {
        this.$scope.$on('switchTab', (event, tab) => {
            if(!event.defaultPrevented){
                event.defaultPrevented = true;
                this.$scope.$broadcast('tabBtn', {id: tab.id, hashes: this.hashes,title:tab.title});
                let params = {};
                params[this.tabSetData.id] = tab.title;
                this.$state.go('.', params, {notify: false});
            }
        })
    }
}
