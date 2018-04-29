/*
 Created by bnaya on 26/01/16, 
 @Component Name: deposit.srv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
 */

export class Deposit {
    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor(requestHandlerService, originService, $http, $rootScope) {
        'ngInject';
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.server = originService.apiUrl;
        this.requestHandlerService = requestHandlerService;
        this.depositApiUrl = originService.depositApiUrl;

    }

    /**
     * @depositingCreditCard
     * Deposit request.
     * @return - {promise} server response.
     */
    depositingCreditCard(params,popupSettings) {
        
        let apiUrl = `${this.depositApiUrl}/api/layer/deposit_credit_card`;
        //return this.requestHandlerService.requesting(`${this.server}/api/layer/deposit_credit_card`, params);//Gregori
        return this.requestHandlerService.requesting(`${apiUrl}`, params , popupSettings);
    }
}