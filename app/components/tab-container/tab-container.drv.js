import './tab-container.less';

export default angular.module('app.page.section.tab-set.tabContainer', [])
    .directive('tabContainer', tabContainerConfig);

function tabContainerConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=',
            index: '@index'
        },
        template: require('./tab-container.tpl.html'),
        controller: tabContainerController,
        controllerAs: 'tabContainer'
    };
}

class tabContainerController {
    constructor($scope, domFactory, $timeout) {
        this.tabContainerData = $scope.data;
        this.tabContainerData.index = $scope.index;
        this.html = "";
        this.html = domFactory.generateArray(this.tabContainerData, 'tabContainer', 'tabContainerData');
        $scope.$on('tabBtn', (event, data) => {
            if(_.includes(data.hashes, this.tabContainerData.index)) {
                this.tabContainerData.show = (this.tabContainerData.index === data.id);
            }
        });
    }

    //currentTab() {    
    //    return this.tabContainerData.index === this.currentTabId;
    //}
}