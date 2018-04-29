/**
 * Created by saar on 25/07/16.
 */

import './wins-widget.less';

export default angular.module('app.page.section.winsWidget', [])
    .directive('winsWidget', winsWidgetConfig);

function winsWidgetConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./wins-widget.tpl.html'),
        controller: WinsWidgetController,
        controllerAs: 'winsWidget'
    }
}

class WinsWidgetController {
    constructor($scope, domFactory, userService) {
        this.winsWidgetData = $scope.data;
        // this.headline = {
        //     title: `Total of ${this.totalAmount} wins`,
        //     class: 'hl4'
        // };
        userService.getWinsBarData().then((wins) => {

            let ids = _.findKeyInObj(this.winsWidgetData, 'id');
            
            let commoditiesId = _.find(ids, {id: "commodities"});
            let currenciesId = _.find(ids, {id: "currencies"});
            let pairsId = _.find(ids, {id: "pairs"});
            let indicesId = _.find(ids, {id: "indices"});
            let stocksId = _.find(ids, {id: "stocks"});

            let commoditiesAmount = wins.commodities || 0;
            let currenciesAmount = wins.currencies || 0;
            let pairsAmount = wins.pairs || 0; 
            let indicesAmount = wins.indices || 0;
            let stocksAmount = wins.stocks || 0;

            commoditiesId.text = `${commoditiesAmount} wins`;
            currenciesId.text = `${currenciesAmount} wins`;
            pairsId.text = `${pairsAmount} wins`;
            indicesId.text = `${indicesAmount} wins`;
            stocksId.text = `${stocksAmount} wins`;

            this.totalAmount = commoditiesAmount + currenciesAmount + pairsAmount + indicesAmount + stocksAmount;

            this.bars = [{value: (currenciesAmount/this.totalAmount)*100, color: "torq"}, {value: (indicesAmount/this.totalAmount)*100, color: "yellow"}, {value: (commoditiesAmount/this.totalAmount)*100, color: "orange"}, {value: (pairsAmount/this.totalAmount)*100, color: "blue"}, {value: (stocksAmount/this.totalAmount)*100, color: "pink"}];

            this.html = '';
            this.html = domFactory.generateArray(this.winsWidgetData, 'winsWidget', 'winsWidgetData');
            this.loaded = true;
        });
    }
}