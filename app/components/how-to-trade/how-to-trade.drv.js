import './how-to-trade.less';

export default angular.module('app.page.section.howToTrade', [])
    .directive('howToTrade', howToTradeConfig);

function howToTradeConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./how-to-trade.tpl.html'),
        controller: howToTradeController,
        controllerAs: 'howToTrade'
    }
}

class howToTradeController {
    constructor($scope, domFactory) {
        this.howToTradeData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.howToTradeData, 'howToTrade', 'howToTradeData');
    }
}