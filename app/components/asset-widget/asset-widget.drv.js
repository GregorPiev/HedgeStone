import './asset-widget.less';

/**
 * @deprecated - currently this component is not in use.
 * @Description: Widget containing content.
 */
export default angular.module('app.page.section.assetWidget', [])
    .directive('assetWidget', assetWidgetConfig);

/**
 * @deprecated
 * @returns {{restrict: string, replace: boolean, scope: {data: string}, template: *, controller: assetWidgetController, controllerAs: string}}
 */
function assetWidgetConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./asset-widget.tpl.html'),
        controller: assetWidgetController,
        controllerAs: 'assetWidget'
    }
}

/**
 * @deprecated
 */
class assetWidgetController {
    constructor($scope) {
        this.accountOverviewData = $scope.data;
        this.html = "";
        if(typeof this.accountOverviewData.array !== 'undefined' || !_.isEmpty(this.accountOverviewData.array)) {
            if(typeof this.accountOverviewData.array[0].precedence !== 'undefined')
                this.accountOverviewData.array.sort(function(a, b){return a.precedence-b.precedence});
            angular.forEach(this.accountOverviewData.array, (value, key)=> {
                let component = Object.keys(value)[0];
                this.html += "<"+component+" data=\"assetWidget.accountOverviewData.array["+key+"]['"+component+"']\"></"+component+">";
            });
        }
        if(typeof this.accountOverviewData.body !== 'undefined' || !_.isEmpty(this.accountOverviewData.body)) {
            angular.forEach(this.accountOverviewData.body, (value, key)=> {
                this.html += "<"+key+" data=\"assetWidget.accountOverviewData.body['"+key+"']\"></"+key+">";
            });
        }
    }
}