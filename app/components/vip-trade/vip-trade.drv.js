/**
 * Created by saar on 25/07/16.
 */

import './vip-trade.less';

export default angular.module('app.page.section.vipTrade', [])
    .directive('vipTrade', vipTradeConfig);

function vipTradeConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./vip-trade.tpl.html'),
        controller: vipTradeController,
        controllerAs: 'vipTrade'
    }
}

class vipTradeController {
    constructor($scope, popupsService, userService) {
        this.popupsService = popupsService;
        this.userService = userService;
        this.vipTradeData = $scope.data;
    }

    vipTradeSessionRequest() {
        this.userService.checkTotalDeposits().then((isOver250k) => {
            if(isOver250k) {
                this.popupsService.popItUp({
                    settemplate: 'custom',
                    type: 'popup',
                    headline: 'VIP Session Request',
                    content: 'By clicking the OK button, your Financial Manager will be notified for your VIP session request.',
                    yesbtntitle: 'OK',
                    nobtntitle: 'Cancel',
                    cancel: function () {
                        this.popupsService.popItDown();
                    },
                    no: function () {
                        this.popupsService.popItDown();
                    },
                    yes: function () {
                        this.popupsService.popItDown();
                        this.userService.sendVipTrade('over');
                    }
                });
            } else {
                this.popupsService.popItUp({
                    settemplate: 'custom',
                    type: 'popup',
                    headline: 'VIP Session Request',
                    content: 'By clicking the OK button, your Account Manager will be notified for your VIP session request. We also recommend contacting your Account Manager directly.',
                    yesbtntitle: 'OK',
                    nobtntitle: 'Cancel',
                    cancel: function () {
                        this.popupsService.popItDown();
                    },
                    no: function () {
                        this.popupsService.popItDown();
                    },
                    yes: function () {
                        this.popupsService.popItDown();
                        this.userService.sendVipTrade('under');
                    }
                });
            }
        });
    }
}
