export class Btns {
    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor($location, $window, popupsService, authService, localStorageService, userService, $state) {
        'ngInject';
        this.$location = $location;
        this.userService = userService;
        this.$window = $window;
        this.$state = $state;
        this.popupsService = popupsService;
        this.authService = authService;
        this.localStorageService = localStorageService;
    }

    promotionBtn(promotion) {
        let params = {promotion}
        this.authService.isUserLogging()
            .then(() => {
                this.popupsService.popItUp({
                    type: 'popup',
                    settemplate: 'custom',
                    yes: function() {
                        this.userService.requestPromotion(params).then(() => {
                            this.popupsService.popItDown();
                            this.$state.go('trade');
                        }).catch(() => {
                            this.popupsService.popItDown();
                        });
                    },
                    yesbtntitle: "APPROVE REQUEST",
                    headline: "Promotion Request",
                    content: `By Clicking the “APPROVE REQUEST” button you will send your promotion “<text according to the promotion name>” request ticket to our system.
                    <br /><br />
                    One of our agents will get back to you to fulfill your request.
                    <br /><br />
                    Thank you,<br />
                    The Hedgestone Group`
                });
            }).catch(() => {
                this.popupsService.popItUp({
                    type: 'popup',
                    settemplate: 'custom',
                    yes: function() {
                        this.$state.go('login');
                        this.popupsService.popItDown();
                        this.localStorageService.cookie.set('redirect', 'promotion', 1);
                    },
                    yesbtntitle: "LOGIN",
                    no: function() {
                        this.$state.go('create_account');
                        this.popupsService.popItDown();
                        this.localStorage.set('redirect', 'promotion');
                    },
                    nobtntitle: "OPEN AN ACCOUNT",
                    headline: "Promotion Request",
                    content: `In order to receive our promotional gifts, you should login or create an account.`
                });
            });
    }
}
