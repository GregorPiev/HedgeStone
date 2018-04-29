/**
 * Created by saar on 12/09/16.
 */

import currencyList from '../../../../assets/jsons/currency.json';

export class Bonus {
    constructor($http, originService, popupsService, $timeout, $state,$rootScope) {
        'ngInject';
        this.$http = $http;
        this.$timeout = $timeout;
        this.$state = $state;
        this.popupsService = popupsService;
        this.originService = originService;
        this.rootScope = $rootScope;
    }


    setUserConfig(id, currency) {
        this.id = id;

        // getting the user's currency
        let _currency = _.find(currencyList, {"code": currency});

        // If the currency was found in the list, take its symbol, otherwise take the currency initials defined by the user
        this.symbol = _currency ? _currency.symbol : _currency;
    }

    checkPendingBonuses() {
        let param = {
            brandId: this.originService.brand
        };        
        
        this.$http.post(`${this.originService.apiUrl}/api/layer/check_pending_bonus`, param).then((res) => {
            
            this.bonusQueue = res.data.data;
            if (res.data.success) {
                _.forEach(this.bonusQueue, (value, key) => {
                    this.popBonus(value);
                });
            }
        });
    }

    popBonus(bonusData) {       
        
        let approvalDecision = {
            bonusId: bonusData.bonusId,
            amount: bonusData.amount,
            customerId: bonusData.customerId || this.id,
            brandId: this.originService.brand
        };

        this.popupsService.popItUp({
            type: 'popup',
            settemplate: 'bonus',
            content: `${this.symbol}${bonusData.amount}`,
            removecancel: true,
            cancel: () => {
                this.popupsService.popItDown();
            },
            yes: () => {
                approvalDecision.response = "approve";
                this.popupsService.popItDown();
                approvalDecision.agreement_popup = true;
                this.sendBonusDecisionToAPI(approvalDecision);
            },
            no: () => {
                approvalDecision.response = "decline";
                this.popupsService.popItDown();
                this.sendBonusDecisionToAPI(approvalDecision);
            }
        });
    }

    sendBonusDecisionToAPI(approvalDecision) {       
        
        let spotBonusId;        
        return this.$http.post(`${this.originService.apiUrl}/api/layer/customer_response_bonus`, approvalDecision).then((res) => {
            
            if(res.data.success) {
                switch (res.data.message) {

                    // the user declined the bonus.
                    case 'decline': {
                        break;
                    }

                    // the account balance with the bonus failed at spot
                    case 'spot': {
                        break;
                    }

                    // the user tried to approve the bonus more than once.
                    case 'logout': {
                        _.forEach(this.bonusQueue, (value, key) => {
                            this.popupsService.popItDown();
                        });
                        this.$state.go('logout'); // throw the user away due to malicious action
                        break;
                    }

                    // the action succeeded and the user got his bonus
                    case '': {
                        spotBonusId = res.data.spotBonusId;

                        this.popupsService.popItUp({
                            type: 'popup',
                            settemplate: 'custom',
                            headline: 'Success',
                            content: `You accepted our Bonus Offer ${spotBonusId} Of ${this.symbol}${approvalDecision.amount}. Your account balance will be updated accordingly.<br>Enjoy trading with us, The Hedgestone Group.`,
                            cancel: () => {
                                this.popupsService.popItDown();
                            }
                        }, 'first', 5000);
                    }
                }
            } else {
                // the action failed at server
            }
        });
    }


}
