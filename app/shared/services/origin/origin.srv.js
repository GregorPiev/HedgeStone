import config from '../../../../../label.json';

export class Origin {
    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor($location, $window, $document) {
        'ngInject';
        this.$location = $location;
        this.$window = $window;
        let env = `${config.shortLabel}`;
        let depositEnv = `${config.depositThreeDLabel}`;
        this.apiUrl = `${config.api}`;
        this.brand = `${config.brand}`;
        this.referrer = `${config.referrer}`;
        this.depositApiUrl = `https://${depositEnv}.globalapisystems.com`;
        this.socketPort = `7000`;
        this.init();
    }

    /**
     * @init(async)
     * Initial function on startup the service.
     * @result - env info.
     */
    init() {
        // fix for IE
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }
        this.detectEnv();
        this.getOriginUrl();
    }

    /**
     * @detectEnv
     * decide which api to use.
     * @result - match api for every e nv.
     */
    detectEnv() {
        this.socketServerUrl = `https://socket.hedgestonegroup.com:${this.socketPort}`;

        if (typeof this.$location.$$search.api !== `undefined`) {
            this.apiUrl = this.$location.$$search.api;
        } else {
            switch (this.$location.$$host) { //               
                case `dev-gregori.${config.url}`:
                    //this.apiUrl = `https://api.${config.url}`;
                    //this.apiUrl = `http://dev-sergey-api.${config.url}`;
                    //this.depositApiUrl = `http://dev-sergey-api.${config.url}`;

//                    this.apiUrl = `https://dev-staging-api.${config.url}`;
//                    this.depositApiUrl = `https://dev-staging-api.${config.url}`;
                    this.depositApiUrlWallet = `https://dev-staging-deposit.globalapisystems.com`;
                    
                    this.apiUrl = `http://dev-gregori-api.${config.url}`;
                    this.depositApiUrl = `http://dev-gregori-api.${config.url}`;
                    //this.depositApiUrlWallet = `http://dev-gregori-deposit.globalapisystems.com`;
                    
                    //this.socketServerUrl = `https://socket.hedgestonegroup.com:${this.socketPort}`;

                    //this.apiUrl = `http://dev-sergey-api.${config.url}`;
                    //this.depositApiUrl = `http://dev-sergey-api.${config.url}`;
                    //this.depositApiUrlWallet = `http://dev-sergey-deposit.globalapisystems.com`;
                    this.urlEnglishSite =`dev-staging.${config.url}`;
                    this.urlEspaniolSite =`dev-es-staging.${config.url}`;
                    //this.socketServerUrl = `https://socket.hedgestonegroup.com:${this.socketPort}`;
                    break;               
                case `dev-staging.${config.url}`:
                    this.apiUrl = `https://dev-staging-api.${config.url}`;
                    //this.depositApiUrl = `https://dev-staging-deposit.globalapisystems.com`;
                    this.depositApiUrl = `https://dev-staging-api.${config.url}`;
                    this.depositApiUrlWallet = `https://dev-staging-deposit.globalapisystems.com`;
                    this.urlEnglishSite =`dev-staging.${config.url}`;
                    this.urlEspaniolSite =`dev-es-staging.${config.url}`;

                    break;
                case `dev-es-staging.${config.url}`:
                    this.apiUrl = `https://dev-staging-api.${config.url}`;
                    //this.depositApiUrl = `https://dev-staging-deposit.globalapisystems.com`;
                    this.depositApiUrl = `https://dev-staging-api.${config.url}`;
                    this.depositApiUrlWallet = `https://dev-staging-deposit.globalapisystems.com`;
                    this.urlEnglishSite =`dev-staging.${config.url}`;
                    this.urlEspaniolSite =`dev-es-staging.${config.url}`;

                    break;    
                case `localhost`:
                    this.apiUrl = `https://dev-staging-api.${config.url}`;
                    //this.apiUrl = `http://dev-sergey-api.${config.url}`;
                    //this.depositApiUrl = `http://dev-sergey-api.${config.url}`;
                    this.depositApiUrl = `https://dev-staging-deposit.globalapisystems.com`;
                    this.depositApiUrlWallet = `https://deposit.globalapisystems.com`;
                    this.urlEnglishSite =`dev-staging.${config.url}`;
                    this.urlEspaniolSite =`dev-es-staging.${config.url}`;
                    
                    this.socketServerUrl = `https://socket.hedgestonegroup.com:${this.socketPort}`;
                    break;
                default:
                    this.apiUrl = `https://api.${config.url}`;
                    this.socketServerUrl = `https://socket.hedgestonegroup.com:${this.socketPort}`;
                    this.depositApiUrl = `https://api.${config.url}`;
                    this.depositApiUrlWallet = `https://deposit.globalapisystems.com`;
                    this.urlEnglishSite =`${config.url}`;
                    this.urlEspaniolSite =`es.${config.url}`;
            }
        }
    }

    /**
     * @isLocalEnv
     * check if origin is localhost.
     * @return - {bool}.
     */
    isLocalEnv() {
        return (this.$location.$$host === `localhost`);
    }

    /**
     * @isDevEnv
     * check if origin is dev server.
     * @return - {bool}.
     */
    isDevEnv() {
        return (this.$location.$$host !== `${config.url}` && this.$location.$$host !== `www.${config.url}`);
    }

    getOriginUrl() {
        this.originUrl = this.$window.location.origin;
    }

}
