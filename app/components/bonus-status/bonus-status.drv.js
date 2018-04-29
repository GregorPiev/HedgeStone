/*
 Created by bnaya on 28/01/16, 
 @Component Name: bonusStatus.drv
 @Description: Acting as a <div> HTML tag
 @Params: 
 @Return: 
 @Methods: 
*/

// List of currencies with detailed information for each kind
import currencyList from  '../../../assets/jsons/currency.json'

import './bonus-status.less';

export default angular.module('app.page.section.bonusStatus', [])
    .directive('bonusStatus', bonusStatusConfig);

function bonusStatusConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./bonus-status.tpl.html'),
        controller: bonusStatusController,
        controllerAs: 'bonusStatus'
    }
}

class bonusStatusController {
    constructor($scope, userService) {
        this.bonusStatusData = $scope.data;
        this.$scope = $scope;
        this.userService = userService;

        this.active = false;
        this.promoBonus = userService.userData.promo.bonus;

        this.updatePromoBonus();
        this.getUserCurrencySymbol()
        this.buildStatus();        
    }

    updatePromoBonus() {
        this.$scope.$on('bonusUpdate', (event, params) => {
            if(this.bonusStatusData.name === params.field) {
                if(params.success) {
                    this.active = true;
                    this.promoBonus = params.promoBonus;
                    this.buildStatus();
                } else {
                    this.active = false;
                }
            }
        });

        this.$scope.$on('bonusUpdatePromo', (event, params) => {                  
            if(this.bonusStatusData.name === params.field) {
                if(params.success) {
                    this.active = true;
                    this.promoBonus = params.promoBonus;
                    this.buildStatus();
                } else {
                    this.active = false;
                }
            }
        });
        
        this.$scope.$on('bonusUpdatePromoEcoPayz', (event, params) => {              
            if(this.bonusStatusData.name === params.field) {
                if(params.success) {
                    this.active = true;
                    this.promoBonus = params.promoBonus;
                    this.buildStatus();
                } else {
                    this.active = false;
                }
            }
        });
        
        this.$scope.$on('bonusUpdatePromoSkrill', (event, params) => {                     
            if(this.bonusStatusData.name === params.field) {
                if(params.success) {
                    this.active = true;
                    this.promoBonus = params.promoBonus;
                    this.buildStatus();
                } else {
                    this.active = false;
                }
            }
        });
        
        this.$scope.$on('bonusUpdatePromoNeteller', (event, params) => {                  
            if(this.bonusStatusData.name === params.field) {
                if(params.success) {
                    this.active = true;
                    this.promoBonus = params.promoBonus;
                    this.buildStatus();
                } else {
                    this.active = false;
                }
            }
        });
        
        this.$scope.$on('bonusClose', (event, params) => {            
                    this.active=false;
        });

    }

    getUserCurrencySymbol() {
        let currency = _.find(currencyList, {"code": this.userService.userData.userSession.currency});
        // If the currency was found in the list, take its symbol, otherwise take the currency initials defined by the user
        this.symbol = currency ? currency.symbol : this.userService.userData.userSession.currency;
    }

    buildStatus() {
        this.status = `Your bonus is: ${this.symbol}${this.promoBonus.toFixed(1)}`;
    }
}