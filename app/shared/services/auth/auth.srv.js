export class Auth {
    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor($http, userService, localStorageService, $q, resolutionChecker, $state, $window, originService, $document, requestHandlerService, bonusService) {
        'ngInject';
        this.$http = $http;
        this.$q = $q;
        this.$window = $window;
        this.$document = $document;
        this.$state = $state;
        this.bonusService = bonusService;
        this.localStorageService = localStorageService;
        this.userService = userService;
        this.resolutionChecker = resolutionChecker;
        this.requestHandlerService = requestHandlerService;
        this.server = originService.apiUrl;
        this.init();
    }

    /**
     * @init(async)
     * Initial function on startup the service.
     * @result - login info.
     */
    init() {
        this.userService.isUserCountryBlocked().then(() => {
            this.isUserLogging().then(() => {                
                const utm_source = this.localStorageService.get(`utm_source`);
                if (!_.isNull(utm_source)) {
                    this.updateUtmSource({utm_source});
                }
            }, () => {
               
            });
        }).catch(() => {
            this.isUserLogging().then(() => {
                
            }, () => {
                
            });

        });
    }

    /**
     * @logging(async)
     * Logging user.
     * @param {string} name - user name or email address.
     * @param {string} pwd - user password.
     * @param {string} redirect - redirect url (optional).
     * @param {bool} autoLogin - if login came from Landing page or any auto login address (optional).
     * @return - user session.
     */
    logging(params, redirect, autoLogin) {
        //let params = { // Build object with the right properties name.
        //    user_name: name,
        //    password: pwd
        //};
        let success = (response) => {
            this.localStorageService.set('token', response.data.message.session.session_id);
            this.bonusService.checkPendingBonuses();
            this.userService.userIsLogin(response.data.message.session);
            const navigate = this.localStorageService.get(`navigate`);
            if (_.isNull(navigate)) {
                if (redirect) {
                    this.$state.go(redirect);
                } else {
                    if (!_.isUndefined(this.localStorageService.cookie.get('redirect')) && !_.isNull(this.localStorageService.cookie.get('redirect'))) {
                        this.$state.go(this.localStorageService.cookie.get('redirect'));
                        this.localStorageService.cookie.remove('redirect')
                    } else if (this.resolutionChecker.isMobile() || autoLogin) {
                        this.$state.go('deposit');
                    } else {
                        this.$state.go('trade');
                    }
                }
            } else {
                this.localStorageService.remove('navigate');
            }
            return response;
        };

        const utm_source = this.localStorageService.get(`utm_source`);
        if (!_.isNull(utm_source)) {
            params['utm_source'] = utm_source;
            this.localStorageService.remove('utm_source');
        }

        return this.requestHandlerService.requesting(`${this.server}/api/layer/login`, params).then(success);
    }

    /**
     * @registering(async)
     * registering user.
     * @param {object} formData - full form data.
     * @return - user session.
     */
    registering(params) {
        let success = (response) => {
            let loginParams = {'user_name': params.email, password: params.password};
            this.logging(loginParams).then((response) => {
               
            }, (response) => {
                
            });
        };
        return this.requestHandlerService.requesting(`${this.server}/api/layer/create`, params).then(success);
    }

    /**
     * @isUserLogging(async)
     * checking if user already logged in.
     * @return - user session.
     */
    isUserLogging() {
        //let deferred = this.$q.defer();
        if (!this.userService.userData.loginTried) {
            return this.$http.get(this.server + '/api/layer/read', {async: true}).then((response) => {
                if (response.data.id) { // Check if user is log in.
                    this.localStorageService.set('token', response.data.session_id); // Set session id to local storage under 'token' name.
                    this.userService.userData.loginTried = true; // Mark true login try.
                    this.userService.userIsLogin(response.data);
                    return response;
                } else {
                    this.userService.userData.loginTried = true; // Mark true login try.
                    return this.$q.reject(response);
                }
            });
        } else {
            if (!this.userService.userData.isUserLogin) // Check if user is log off.
                return this.$q.reject(); // Return reject.
            else {
                return this.$q.when(this.userService.userData.isUserLogin);
                //deferred.resolve(this.userService.userData.isUserLogin);
                //return deferred.promise;
            }

        }
    }

    /**
     * @loggingOut(async)
     * logging out user.
     * @result - clear session on server, client and local storage.
     */
    // TODO: Handle errors
    loggingOut() {
        return this.$http.get(this.server + "/api/layer/logout", {async: true}).then(() => {
            this.localStorageService.clearAll(); // Clear local storage.
            this.userService.userIsLoggingOut();
            // this.apiSocketService.closeSocket();
        });
    }

    /**
     * @resetPasswordByEmail(async)
     * request reset password email from user.
     * @param {object} params - contain user email.
     * @return - response from server.
     */
    resetPasswordByEmail(params) {
        return this.requestHandlerService.requesting(`${this.server}/api/layer/send_reset_password_email`, params);
    }

    /**
     * @verifyToken(async)
     * verify token and email before reset password.
     * @param {object} params - contain email and token.
     * @return - response from server.
     */
    verifyToken(params) {
        return this.requestHandlerService.requesting(`${this.server}/api/layer/verify_password_reset_token`, params);
    }

    /**
     * @newPassword(async)
     * changing password.
     * @param {object} params - contain email, password and token.
     * @return - response from server.
     */
    // TODO: Handle errors
    newPassword(params) {
        return this.requestHandlerService.requesting(`${this.server}/api/layer/reset_password`, params);
    }

    /**
     * @updateUtmSource(async)
     * changing password.
     * @param {object} params - contain email, password and token.
     * @return - response from server.
     */
    // TODO: Handle errors
    updateUtmSource(params) {
        return this.requestHandlerService.requesting(`${this.server}/api/layer/update_utm_source`, params)
                .then(() => {
                    this.localStorageService.remove('utm_source');
                });
    }
}
