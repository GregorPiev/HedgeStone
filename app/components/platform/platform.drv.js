/*
 Created by bnaya on 28/01/16,
 @Component Name: page.drv
 @Description:
 @Params:
 @Return:
 @Methods:
 */
//import ngField from 'ng-field/ng-field.drv';

import './platform.less';

export default angular.module('app.platform', [])
        .directive('platform', platformConfig);

function platformConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./platform.tpl.html'),
        controller: platformController,
        controllerAs: 'platform'
    }
}

class platformController {
    constructor($scope, $window, userService, $document, popupsService, $state, loadingFrameService, $location, $timeout, resolutionChecker) {
        this.$document = $document;
        this.$scope = $scope;
        this.type = $scope.data.type;
        this.userService = userService;
        this.popupsService = popupsService;
        this.resolutionChecker = resolutionChecker;
        this.$window = $window;
        this.$state = $state;
        this.loadingFrameService = loadingFrameService;
        this.trade_risk = false;
        this.domain = ($location.$$host === 'localhost') ? "" : ".hedgestonegroup.com/";
        this.platformReady = false;
        if ($state.current.name === 'trade') {
            this.init();
        } else {
            this.initMyAccount();
        }
    }

    init() {
        this.userService.updateSession().then(() => {
            let noTrade = 1;
            let trade_risk = Number(this.userService.userData.userSession.trade_risk);
            if (!Number(this.userService.userData.userSession['trade_block']) || this.userService.userData.userSession['regStatus'] === 'noTrade')
                noTrade = 0;
            
            
            this.html = `<iframe id="iframePlatform" src="https://www.hedgestonegroup.com/platform.php?token=${this.userService.userData.userSessionId}&noTrade=${noTrade}&tradeRisk=${trade_risk}" ng-show="platform.platformReady" frameborder="0"></iframe>`;
            //this.html = `<iframe id="iframePlatform" src="https://dev-gregori.hedgestonegroup.com/platform.php?token=${this.userService.userData.userSessionId}&noTrade=${noTrade}&tradeRisk=${trade_risk}" ng-show="platform.platformReady" frameborder="0"></iframe>`;
        });

        this.onPlatformMessage();
        this.termsPopup();
        // this.noTradePopup();
    }

    onPlatformMessage() {
        var self = this;
        var init = false;
        this.$window.addEventListener('message', (event) => {
            this.notReady = false;
            if (event.origin === 'https://www.hedgestonegroup.com') {
                this.tradeBlock = false;
                let data = JSON.parse(event.data);
                // TODO: Pass the balance update code to the widget him ctrl to work with model.
                if (data.popupTerms) {
                    self.termsPopup();
                }

                if (data.popupRegulation) {
                    self.noTradePopup();
                }

                if (self.userService.userData.userSession['regStatus'] === 'noTrade' && !this.tradeBlock) {
                    self.popupsService.popItUp({
                        type: 'popup',
                        settemplate: "tradeBlock",
                        cancel: function () {
                            this.popupsService.popItDown();
                            //this.$state.go('about');
                        },
                        no: function () {
                            this.popupsService.popItDown();
                            //this.$state.go('about');
                        },
                        yes: function () {
                            this.popupsService.popItDown();
                            this.$state.go('about');
                        }
                    });
                }

                if (typeof data.balance !== 'undefined') {
                    $('#userBalance .title').html(data.balance);
                    if (!init) {
                        self.platformReady = true;
                        self.loadingFrameService.stopLoading();

                        //if(!Number(self.userService.userData.userSession['trade_risk'])) {
                        //    setTimeout(() => {
                        //        $(".platform iframe").contents().click(function(event) {
                        //            self.termsPopup();
                        //            event.stopPropagation();
                        //            self.$scope.$apply();
                        //        });
                        //    }, 0);
                        //}
                        init = true;
                    }
                    self.$scope.$apply();
                }

                if (data.sessionExpired) {
                    self.logoutExpiredSession();
                }
            }
        });
    }

    logoutExpiredSession() {
        this.$state.go('logout', {'login': true});
    }

    termsPopup() {
        if (!Number(this.userService.userData.userSession.trade_risk)) {
            this.popupsService.popItUp({
                type: 'popup',
                settemplate: 'terms',
                cancel: function () {
                    this.popupsService.popItDown();
                    //this.$state.go('about');
                },
                no: function () {
                    this.popupsService.popItDown();
                    //this.$state.go('about');
                },
                yes: function () {
                    this.userService.setApproveTradeRisk()
                            .then(() => {
                                this.popupsService.popItDown();
                                this.userService.userData.userSession.trade_risk = 1;
                                this.$state.reload();
                            })
                            .catch(() => {
                                this.popupsService.popItDown();
                                this.$state.go('about');
                            });
                }
            });
        }
    }

    noTradePopup() {
        let block = 0;
        let open = 1;
        let partialBlock = 2;
        switch (Number(this.userService.userData.userSession['trade_block'])) {
            case block:
                this.tradeBlock = true;
                this.popupsService.popItUp({
                    type: 'popup',
                    settemplate: 'tradeBlock',
                    cancel: function () {
                        this.popupsService.popItDown();
                        //this.$state.go('about');
                    },
                    no: function () {
                        this.popupsService.popItDown();
                        //this.$state.go('about');
                    },
                    yes: function () {
                        this.popupsService.popItDown();
                        this.$state.go('about');
                    }
                });
                break;
            case open:
                break;
            case partialBlock:
                this.popupsService.popItUp({
                    type: 'popup',
                    settemplate: 'tradeBlock',
                    cancel: function () {
                        this.userService.userData.userSession['trade_block'] = 1;
                        this.popupsService.popItDown();
                    },
                    no: function () {
                        this.userService.userData.userSession['trade_block'] = 1;
                        this.popupsService.popItDown();
                    },
                    yes: function () {
                        this.userService.userData.userSession['trade_block'] = 1;
                        this.popupsService.popItDown();
                        this.$state.go('about');
                    }
                });
                break;
        }
    }

    initMyAccount() {
        this.userService.updateSession().then(() => {
            this.html = this.resolutionChecker.isMobile() ? '' : `<iframe id="iframePlatform" src="https://www.hedgestonegroup.com/myAccountPlatform.php?token=${this.userService.userData.userSessionId}" frameborder="0"></iframe>`;
        });
    }
}



// var urlParams;
// var platDir = 'LTR';
// (window.onpopstate = function () {
//     var match,
//         pl     = /\+/g,  // Regex for replacing addition symbol with a space
//         search = /([^&=]+)=?([^&]*)/g,
//         decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
//         query  = window.location.search.substring(1);
//     urlParams = {};
//     while (match = search.exec(query))
//         urlParams[decode(match[1])] = decode(match[2]);
// })();
// if (typeof(urlParams.lang) == "undefined")
//     platformLang= "en";
// else{
//     platformLang = urlParams.lang;
//     if(urlParams.lang == "ar" || urlParams.lang == "he")
//         platDir = 'RTL';
// }
// SO.load({
//     lang : platformLang,
//     dir: platDir,
//     cookieOptions : {
//         domain : '.hedgestonegroup.com'
//     },
//     packages : {
//         MyAccount : {
//             settings : {
//                 selector : '#so_container',
//                 depositUrl : 'http://spotplatform.hedgestonegroup.com/appProxy/myAccount.html?activeZone=deposit',
//                 regulationUrl : 'http://spotplatform.hedgestonegroup.com/appProxy/myAccount.html?activeZone=regulation',
//                 tradingUrl : 'http://spotplatform.hedgestonegroup.com/appProxy/platform.html',
//                 contactUsUrl : 'http://spotplatform.hedgestonegroup.com/appProxy/platform.html'
//             }
//         },
//         SpotComm : {
//             settings : {
//                 selector : 'body:first',
//                 notificationsSelector : '#spotComm_notifications_container'
//             }
//         },
//         Clock : {},
//         Balance : {}
//     }
// });
// $('body').css('direction', platDir).attr('direction', platDir);
//
