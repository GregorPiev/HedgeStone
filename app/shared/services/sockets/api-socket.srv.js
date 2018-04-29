/**
 * Created by saar on 06/09/16.
 */

import io from 'socket.io-client';

/**
 * @description: This service is in charge of maintaining a socket with the API for handling real time data sent from the API.
 */
export class ApiSocket {
    constructor($http, originService, popupsService, bonusService) {
        'ngInject';
        this.$http = $http;
        this.bonusService = bonusService;
        this.originService = originService;
        this.popupsService = popupsService;
    }

    /**
     * @description: generate new socket for the client.
     * @param userId
     */
    createNewSocket(customerId) {
        this.apiSocket = io(this.originService.socketServerUrl);
        this.customerId = customerId;
        this.listenToEvents();
    }

    /**
     * @description: listen to events coming from the socket.
     */
    listenToEvents() {
        window.onbeforeunload = () => {
            this.closeSocket();
        };

        this.apiSocket.on('sendLogin', (data) => {
            this.sendLoginToAPI();
        });

        this.apiSocket.on('bonus', (data) => {
            this.bonusService.popBonus(data);
        });

        this.apiSocket.on('forcedDisconnect', (data) => {
            
            this.sendLogoutToAPI();
        });
    }

    /**
     * @description: send login to API so that the socket id will be registered in the DB.
     */
    sendLoginToAPI() {
        let param = {
            socketId: `/#${this.apiSocket.id}`,
            brandId: this.originService.brand
        };

        this.$http.post(`${this.originService.apiUrl}/api/layer/online_customer`, param).then((res) => {
            
        });
    }

    /**
     * @description: send logout to API so that the socket will be wiped from the DB.
     */
    sendLogoutToAPI() {
        let param = {
            customerId: this.customerId,
            brandId: this.originService.brand
        };

        this.$http.post(`${this.originService.apiUrl}/api/layer/disconnect_customer`, param).then((res) => {
            
        });
    }

    /**
     * @description: force socket disconnection when the user logs out from the app.
     */
    closeSocket() {
        this.apiSocket.emit('forceDisconnect');
    }
}
