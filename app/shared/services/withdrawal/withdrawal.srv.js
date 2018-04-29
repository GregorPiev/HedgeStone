/**
 * Created by saar on 05/07/16.
 */

/**
 * Withdrawal service
 */
export class Withdrawal {
    constructor($http, $q, originService, userService, requestHandlerService) {
        'ngInject';
        this.$http = $http;
        this.$q = $q;
        this.server = originService.apiUrl;
        // this.userService = userService;
        this.requestHandlerService = requestHandlerService;
        this.init();
    }

    /**
     * init
     * initiating the Service - update user's account balance before doing any action
     */
    init() {
        //this.userService.updateAccountBalance();
    }

    /**
     * commitWithdrawal
     * perform the call to the API in order to withdrawal
     * @param amount - amount for withdrawal
     */
    commitWithdrawal(params) {
       
        return this.requestHandlerService.requesting(`${this.server}/api/layer/makeWithdrawal`, params);
        // return this.$http.post(this.server + '/api/layer/makeWithdrawal', params, {async: true, cache: false}).then((response) => {
        
        //     if(response.data.success) {
        //         return response.data.success;
        //     } else {
        //         return response.data.error;
        //     }
        // });
    }
}
