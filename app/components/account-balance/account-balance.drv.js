/**
 * @Component Name: account-balance.drv
 * @Description: Showing the client's account balance
 * @Params:
 * @Return:
 * @Methods:
 */

import './account-balance.less';

// List of currencies with detailed information for each kind
import currencyList from  '../../../assets/jsons/currency.json'

export default angular.module('app.page.section.accountBalance', [])
    .directive('accountBalance', accountBalanceConfig);

function accountBalanceConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./account-balance.tpl.html'),
        controller: accountBalanceController,
        controllerAs: 'accountBalance'
    }
}

class accountBalanceController {
    constructor($scope, domFactory, userService, $filter) {
        this.accountBalanceData = $scope.data;
        this.userService = userService;
        this.$filter = $filter;
        this.html = "";
        this.domFactory = domFactory;
        this.ids = _.findKeyInObj(this.accountBalanceData, 'id');

        this.loading = true;

        // Locate the client currency object in the currency list
        let currency = _.find(currencyList, {"code": this.userService.userData.userSession.currency});

        // If the currency was found in the list, take its symbol, otherwise take the currency initials defined by the user
        let symbol = currency ? currency.symbol : this.userService.userData.userSession.currency;


        switch (this.accountBalanceData.type) {
            case 'positions': {
                this.userService.getOpenPositions().then((positions) => {
                    this.userService.getPotentialProfit().then((payout) => {
                        let openPositions = _.find(this.ids, {id: 'userPositions'});
                        let potentialPayout = _.find(this.ids, {id: 'userPotentialPayout'});
                        openPositions ? openPositions.title = `${this.$filter('currency')(positions, symbol, 2)}` : '';
                        potentialPayout ? potentialPayout.title = `${this.$filter('currency')(payout, symbol, 2)}` : '';
                        this.loading = false;
                        this.html = this.domFactory.generateArray(this.accountBalanceData, 'accountBalance', 'accountBalanceData');
                    });
                });
            }
                break;

            case 'averagePositions': {
                this.userService.getAveragePositions().then((averagePayout) => {
                    if(!averagePayout.amount)
                        averagePayout.amount = 0;
                    let averagePositions = _.find(this.ids, {id: 'averagePositions'});
                    let numPositions = _.find(this.ids, {id: 'bonusPositions'});
                    averagePositions ? averagePositions.title = `${this.$filter('currency')(averagePayout.amount, symbol, 2)}` : '';
                    numPositions ? numPositions.text = `${averagePayout.num_positions} positions` : '';
                    this.loading = false;
                    this.html = this.domFactory.generateArray(this.accountBalanceData, 'accountBalance', 'accountBalanceData');
                });

            }
                break;
            default: {
                this.userService.updateAccountBalance().then(() => {

                    // find the DOM element of the account balance
                    let accountBalance = _.find(this.ids, {id: 'userBalance'});

                    // inject the account balance to the DOM element
                    accountBalance ? accountBalance.title = `${this.$filter('currency')(this.userService.userData.userSession.accountBalance, symbol, 2)}` : '';

                    this.loading = false;

                    this.html = this.domFactory.generateArray(this.accountBalanceData, 'accountBalance', 'accountBalanceData');
                });
            }
                break;
        }
    }
}