/*
 Created by bnaya on 28/01/16,
 @Component Name: ticker.drv
 @Description: The button component
 @Params:
 @Return:
 @Methods:
 */

import tickerAsset from './ticker-asset/ticker-asset.drv';
import './ticker.less';

export default angular.module('page.section.ticker', [tickerAsset.name])
    .directive('ticker', tickerConfig);

function tickerConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ticker.tpl.html'),
        controller: TickerController,
        controllerAs: 'ticker'
    }
}

class TickerController {
    constructor($scope, domFactory, tickerSocketsService, $state, resolutionChecker, userService) {
        this.tickerData = $scope.data;
        this.html = "";
        this.$state = $state;
        this.userService = userService;
        this.html = domFactory.generateArray(this.tickerData, 'ticker', 'tickerData');

        $scope.$on('$destroy', () => {
            $scope.$destroy();
        });


        if (resolutionChecker.checkResolution() === 'mobile' ) {
            this.tickerData.array = this.tickerData.array.slice(0,2)
        } else if (resolutionChecker.checkResolution() === 'tabletSmall') {
            this.tickerData.array = this.tickerData.array.slice(0,3)
        } else if (resolutionChecker.checkResolution() === 'tablet') {
            this.tickerData.array = this.tickerData.array.slice(0,4)
        }

        if(_.isUndefined(tickerSocketsService.assets)) {
            tickerSocketsService.init(this.tickerData.assets, this.tickerData.currencies);
            // socketsService.initCurrencies();
        }

        if(tickerSocketsService.ready) {
            this.ready = true;
        } else {
            $scope.$on('tickerReady', () => {
                this.ready = true;
                $scope.$digest();
            });
        }

        $scope.$on('tickerClose', () => {
            this.ready = false;
            $scope.$apply();
        });
    }

    goToTrade() {
        this.userService.userData.isUserLogin ? this.$state.go('trade') : this.$state.go('login');
    }
}
