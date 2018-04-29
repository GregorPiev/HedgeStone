/*
 Created by bnaya on 28/01/16,
 @Component Name: ticker-asset.drv
 @Description: Acting as a <div> HTML tag
 @Params:
 @Return:
 @Methods:
 */

import './ticker-asset.less';

export default angular.module('app.page.ticker.tickerAsset', [])
    .directive('tickerAsset', tickerAssetConfig);

function tickerAssetConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ticker-asset.tpl.html'),
        controller: TickerAssetController,
        controllerAs: 'tickerAsset'
    }
}

class TickerAssetController {
    constructor($scope, domFactory, tickerSocketsService, $timeout) {
        this.tickerAssetData = $scope.data;
        this.tickerSocketsService = tickerSocketsService;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.switching = true;
        this.randNum;
        this.tool = true;
        this.init();
        // this.html = "";
        // this.html = domFactory.generateArray(this.tickerAssetData, 'tickerAsset', 'tickerAssetData');
    }

    init() {
        this.destroyed = false;
        let readyOnce = false;
        if (this.tickerSocketsService.ready) {
            this.ready = true;
            this.assetData = this.tickerSocketsService.next();
            this.calcRateChangeFromOpeningRate();
            this.switching = false;
            // this.$scope.$digest();
            this.refresh();
        } else {
            this.$scope.$on('tickerReady', () => {
                if (!readyOnce) {
                    readyOnce = true;
                    this.ready = true;
                    this.destroyed = false;
                    this.assetData = this.tickerSocketsService.next();
                    this.calcRateChangeFromOpeningRate();
                    this.switching = false;
                    this.$scope.$digest();
                    this.refresh();
                }
            });
        }

        this.$scope.$on('tickerClose', () => {
            readyOnce = false;
            this.ready = false;
            this.destroyed = true;
            this.$scope.$apply();
        });

        this.$scope.$on('$destroy', () => {
            this.destroyed = true;
            this.$scope.$destroy();
        });
    }

    calcRateChangeFromOpeningRate() {
        let currentRate = Number(this.assetData[0].rate.replace(/,/g, ''));
        let openingRate = Number(this.assetData[1].openValue);
        this.change = (currentRate - openingRate);
        let c = (currentRate === 0) ? 0 : ((this.change / currentRate) * 100);
        this.change = this.addPatternToNumber(this.change, 3);
        c = this.addPatternToNumber(c, 2);
        this.assetData[0].rate = this.addPatternToNumber(this.assetData[0].rate);
        this.changeInPercentage = `${c}`;
    }

    addPatternToNumber(number, length) {
        if (Number(number) > 0) {
            number = length ? `+${number.toFixed(length)}` : `+${number}`;
            if(number > 999) {
                let str = number.toString().split('.');
                str = `${str[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${str[1]}`;
                number = str;
            }
        } else {
            length ? number = number.toFixed(length) : '';
        }
        return number;
    }

    refresh() {
        let self = this;
        if (!self.destroyed && !self.refreshing && this.ready) {
            self.randNum = _.random(10, 20) * 1000;
            self.$timeout(() => {
                self.switching = true;
                self.refreshing = true;
                // self.refreshing = true;
                // self.$scope.$digest();
                // setTimeout(() => {
                self.$timeout(() => {
                    // 
                    self.assetData = self.tickerSocketsService.next();
                    self.calcRateChangeFromOpeningRate();
                    self.switching = false;
                    // self.logoLoading = false;
                    self.refreshing = false;
                    self.refresh();
                }, 700);
                // self.logoLoading = true;
                // self.$scope.$digest();
                // self.refresh();
                // }, 700)
            }, self.randNum);
        }
    }
}
