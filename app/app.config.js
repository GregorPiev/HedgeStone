angular.module('app.config', [])
        .run(function(sitelanguageService){
                  sitelanguageService.setLanguage();                
            })
        .config(['$compileProvider', '$resourceProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 'resolutionCheckerProvider', 'localStorageServiceProvider', '$provide', 'AnalyticsProvider', 'vcRecaptchaServiceProvider', '$cookiesProvider','$urlMatcherFactoryProvider', ($compileProvider, $resourceProvider, $httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, resolutionCheckerProvider, localStorageServiceProvider, $provide, AnalyticsProvider, vcRecaptchaServiceProvider, $cookiesProvider,$urlMatcherFactoryProvider) => {
                $urlMatcherFactoryProvider.strictMode(false);
               let folderLanguageCurrent='';
        
                    $provide.decorator('$log', ['$delegate', '$injector', function ($delegate, $injector) {
                        var QueryString = function () {
                            // This function is anonymous, is executed immediately and
                            // the return value is assigned to QueryString!
                            var query_string = {};
                            var query = window.location.search.substring(1);
                            var vars = query.split("&");
                            for (var i = 0; i < vars.length; i++) {
                                var pair = vars[i].split("=");
                                // If first entry with this name
                                if (typeof query_string[pair[0]] === "undefined") {
                                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                                    // If second entry with this name
                                } else if (typeof query_string[pair[0]] === "string") {
                                    var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                                    query_string[pair[0]] = arr;
                                    // If third or later entry with this name
                                } else {
                                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
                                }
                            }
                            return query_string;
                        }();



                        if (window.location.origin === `https://hedgestonegroup.com` || window.location.origin === `https://www.hedgestonegroup.com` || window.location.origin === `http://dev-gregori.hedgestonegroup.com` && Boolean(QueryString.debug) !== true) {
                            let decoratorLog = function () {
                                let $http = $injector.get('$http');
                                let originService = $injector.get('originService');
                                let args = [].slice.call(arguments);
                                let server = originService.apiUrl;
//                                $http.post(server + '/api/layer/getConsoleLogToDB', {message: angular.toJson(args), "console_type": 3, origin: 1}, {async: true})
//                                        .then(function (response) {
//                                            args.unshift(`Angular Error id: ${response.data.id}`);
//                                            origLog.apply(null, args);
//                                        }).catch(function (response) {
//                                    origLog.apply(null, args);
//                                });
                            };

                            let decoratorError = function () {
                                let $http = $injector.get('$http');
                                let originService = $injector.get('originService');
                                var args = [].slice.call(arguments);
                                let server = originService.apiUrl;
//                                $http.post(server + '/api/layer/getConsoleLogToDB', {message: angular.toJson(args), "console_type": 3, origin: 1}, {async: true})
//                                        .then(function (response) {
//                                            args.unshift(`Angular Error id: ${response.data.id}`);
//                                            origError.apply(null, args)
//                                        }).catch(function (response) {
//                                    origError.apply(null, args);
//                                });
                            };

                            let decoratorTrace = function () {
                                let $http = $injector.get('$http');
                                let originService = $injector.get('originService');
                                var args = [].slice.call(arguments);
                                let server = originService.apiUrl;
//                                $http.post(server + '/api/layer/getConsoleLogToDB', {message: angular.toJson(args), "console_type": 3, origin: 1}, {async: true})
//                                        .then(function (response) {
//                                            args.unshift(`Angular Error id: ${response.data.id}`);
//                                            origTrace.apply(null, args)
//                                        }).catch(function (response) {
//                                    origTrace.apply(null, args);
//                                });
                            };

                            let origLog = $delegate.log;
                            let origError = $delegate.error;
                            let origTrace = $delegate.trace;


                            $delegate.debug = decoratorTrace;
                            $delegate.log = decoratorTrace;
                            $delegate.info = decoratorTrace;
                            $delegate.warn = decoratorTrace;
                            $delegate.error = decoratorError;
                        }

                        return $delegate;
                    }]);

                // Analytics Configuration.
                AnalyticsProvider.setAccount('UA-79218130-1');
                AnalyticsProvider.ignoreFirstPageLoad(true);
                AnalyticsProvider.setPageEvent('$stateChangeSuccess');

                // Enabled debug info classes as "ng-scope".
                $compileProvider.debugInfoEnabled(false);

                // Set for all headers "withCredentials" param.
                $httpProvider.defaults.withCredentials = true;

                // adding property 'next' to $state object for changing states dynamically by their name
                $provide.decorator('$state', function ($delegate, $rootScope) {
                    $rootScope.$on('$stateChangeStart', function (event, state, params) {
                        $delegate.next = state;
                        $delegate.toParams = params;
                    });
                    $rootScope.$on('$stateChangeSuccess', function (event, state, params) {                        
                        $delegate.next = state;
                        $delegate.toParams = params;                        
                    });
                    return $delegate;
                });

                // Set prefix for localstorage.
                localStorageServiceProvider.setPrefix('hgs');

                // if url does not match any of the states, go to homepage
                $urlRouterProvider.otherwise('404');

                // configuration initialization for the app's different resolution changes
                resolutionCheckerProvider.init({mobile: 720, tabletSmall: 770, tablet: 1024, desktop: 1200});

                // google recaptcha config
                // account details under google account dev@hedgestonegroup.com
                vcRecaptchaServiceProvider.setDefaults({
                    key: '6Lch2ScTAAAAABmdXiDw8w2fw8_nJuyj20tm2GV5'
                            // theme: '---- light or dark ----',
                            // stoken: '6Lch2ScTAAAAAAHdMnPPezAGXK97_sA0THWHQOQD',
                            // size: '---- compact or normal ----',
                            // type: '---- audio or image ----'
                });

                // The url for the directory that holds the pages' jsons
                var pagesUrl = (window.location.host !== 'localhost:8080') ? '/pages/' : '../app/components/page/jsons/';

                // The url for the Hedgestone mobile application in Google's play store
                var mobileAppUrl = 'https://play.google.com/store/apps/details?id=com.spotoption.android.hedgestonegroup';

                // Set html5mode only for not localhost servers.
                if (window.location.host !== 'localhost:8080' && window.history && history.pushState)
                    $locationProvider.html5Mode(true);

                // Set share controller to every page that take the page json and insert him to page component.
                let controllerRef = (pageResolver, $scope) => {
                    $scope.stateData = pageResolver;
                };

                // Set Block Country logic for every status we get.
                let blockCountryLogic = (status, popupsService, $state, $q) => {
                    if (window.location.host !== 'localhost:8080') {
                        let fullBlockStatus = 0;
                        // let freeBlockStatus = 1;
                        let semiBlockStatus = 2;
                        if (status === fullBlockStatus) {
                            popupsService.popItUp({
                                type: 'popup',
                                settemplate: 'simple',
                                cancel: function () {
                                    this.popupsService.popItDown();
                                    this.$state.go('about');
                                }
                            });
                            return false;
                        } else if (status === semiBlockStatus && $state.next.name === "create_account") {
                            popupsService.popItUp({
                                type: 'popup',
                                settemplate: 'custom',
                                headline: 'We\'re Sorry',
                                content: 'Unfortunately, due to our regulations your location is banned from doing the requested action',
                                cancel: function () {
                                    this.popupsService.popItDown();
                                    this.$state.go('about');
                                }
                            });
                            return $q.reject();
                        }
                        return true;
                    }
                };

                // Launch block country logic
                let blockCountry = (userService, popupsService, $state, $q) => {
                    userService.isUserCountryBlocked().then((response) => {
                        blockCountryLogic(Number(response), popupsService, $state, $q);
                    });
                };

                // Resolving each page - getting the matching json
                let pageResolver = ($http, $state, loadingFrameService, contentDataService) => {
                    // TODO: get json matching the resolution                   
                    loadingFrameService.startLoading();
                    return contentDataService.getPage(pagesUrl).then((response) => {
                        if ($state.next.name !== 'trade')
                            loadingFrameService.stopLoading();
                        return response;
                    });
                };

                // verify stateParams for article and video states so no empty view  l be presented.
                // TODO: maybe route the url containing the category to latest_news state with the active tab of that category
                let verifyStateParams = ($stateParams, $state, $timeout) => {
                    $timeout(() => {
                        if (!($stateParams.name || $stateParams.id)) {
                            $state.go('home')
                        }
                    }, 0);
                };
                let getCampaign = (localStorageService, $location, loadingFrameService) => {
                    if (typeof $location.$$search.campaign !== 'undefined') {                        
                        localStorageService.set('campaignId', $location.$$search.campaign);
                    }
                    if (typeof $location.$$search.subcampaign !== 'undefined') {                        
                        localStorageService.set('subCampaign', $location.$$search.subcampaign);
                    }
                };
                //PromoCode
                let setPromoCode=(localStorageService, $location) => {
                    let urlSearch=$location.search();

                    $.each(urlSearch, function(key, value) {            
                        if(key.toLowerCase() == 'promocode'){
                            let cookieVal = value;
                            if(localStorageService.get('PromoCode')===undefined || localStorageService.get('PromoCode')!==cookieVal){ 
                                     localStorageService.set('PromoCode', cookieVal);
                            }
                        }
                    });
                };
                
                
                $stateProvider
                        // =========== IMPORTANT: pages files should have the same name as the state's name =========== //
                        .state('home', {
                            url: "/",
                            template: "<page data='stateData'></page>",
                            resolve: {
                                setPromoCode,
                                getCampaign,
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })                         
                        .state('financials', {
                            url: "/financials",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('login', {
                            url: "/login?email&password&extRedir",
                            template: "<page data='stateData'></page>",
                            resolve: {                                 
                                pageResolver: (resolutionChecker, loadingFrameService,sitelanguageService) => {
                                    folderLanguageCurrent=sitelanguageService.getLanguage();
                                    loadingFrameService.stopLoading();
                                    if (resolutionChecker.isMobile()) {
                                        return require(`./components/page/jsons/${folderLanguageCurrent}login-mobile.json`);
                                    } else
                                        return require(`./components/page/jsons/${folderLanguageCurrent}login.json`);
                                },
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('trade', {
                            url: "/trade",
                            template: "<page data='stateData'></page>",
                            resolve: {                                 
                                checkMobile: (resolutionChecker, $state, $q, loadingFrameService, $timeout) => {
                                    if (resolutionChecker.isMobile()) {
                                        $timeout(() => {
                                            $state.go('tools')
                                        }, 0);
                                        if ($state.current.name === 'tools') {
                                            $timeout(() => {
                                                loadingFrameService.stopLoading()
                                            }, 0);
                                            $state.go('tools');
                                        }
                                        return $q.reject();
                                    }
                                },
                                pageResolver: (resolutionChecker, loadingFrameService,sitelanguageService) => {
                                    folderLanguageCurrent=sitelanguageService.getLanguage();
                                    loadingFrameService.startLoading();
                                    if (resolutionChecker.checkResolution() === 'tablet' || resolutionChecker.checkResolution() === 'tabletSmall') {
                                        return require(`./components/page/jsons/${folderLanguageCurrent}trade-tablet.json`);
                                    } else {
                                        return require(`./components/page/jsons/${folderLanguageCurrent}trade.json`);
                                    }
                                },
                                loggedinPage: (userService, authService, $q, $state, popupsService, loadingFrameService) => {
                                    return authService.isUserLogging()
                                            .then(() => true)
                                            .catch(() => {
                                                loadingFrameService.stopLoading();
                                                $state.go('home');
                                            });
                                },
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })                        
                        .state('deposit', {
                            url: "/deposit/:deposit",
                            template: "<page data='stateData'></page>",
                            resolve: {
                                setPromoCode,
                                pageResolver: (authService, userService, $http, $state, loadingFrameService, $location, sitelanguageService) => {
                                    let pagesUrlExt=sitelanguageService.getLanguage();
                                    loadingFrameService.startLoading();
                                    return authService.isUserLogging()
                                            .then(() => {
                                                
                                                return $http.get(`${pagesUrl+pagesUrlExt}depositThreeD.json`).then((response) => {
                                                                loadingFrameService.stopLoading();
                                                                return response.data;
                                                 });
                                                  
                                            })
                                            .catch(() => {
                                                    $state.go(`login`);
                                            });
                                },
                                loggedinPage: (userService, authService, $q, $state, loadingFrameService) => {
                                    if (!userService.userData.loginTried) {
                                        loadingFrameService.stopLoading();
                                        return authService.isUserLogging().then(() => true).catch(() => $state.go('home'));
                                    } else {
                                        return authService.isUserLogging().then(() => true).catch(() => $q.reject());
                                    }
                                },
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('forgot_password', {
                            url: "/forgot_password",
                            template: "<page data='stateData'></page>",
                            resolve: {
                                setPromoCode,
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('verify_token', {
                            url: "/verify_token",
                            template: "<page data='stateData'></page>",
                            resolve: {
                                // TODO: Fix page auth for this state
                                //pageAuth: (userService, $state, $timeout, $q) => {
                                //    if (typeof userService.userData.resetPassword.email === 'undefined') {
                                //        $timeout(()=> {
                                //            $state.go('forgot_password');
                                //        }, 0);
                                //        return $q.reject();
                                //    }
                                //},                                
                                setPromoCode,
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('reset_password', {
                            url: "/reset_password",
                            template: "<page data='stateData'></page>",
                            resolve: {
                                setPromoCode,
                                pageAuth: (userService, $state, $timeout, $q) => {
                                    if (typeof userService.userData.resetPassword.token === 'undefined') {
                                        if (typeof userService.userData.resetPassword.email === 'undefined') {
                                            $timeout(() => {
                                                $state.go('forgot_password');
                                            }, 0);
                                            return $q.reject();
                                        }
                                        $timeout(() => {
                                            $state.go('verify_token');
                                        }, 0);
                                        return $q.reject();
                                    }
                                },
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('create_account', {
                            url: "/create_account",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver: (localStorageService, $location, loadingFrameService, sitelanguageService) => {
                                    if (typeof $location.$$search.utm_campaign !== 'undefined') {
                                        localStorageService.set('utm_campaign', $location.$$search.utm_campaign);
                                    }
                                    folderLanguageCurrent=sitelanguageService.getLanguage();
                                    loadingFrameService.stopLoading();
                                    return require(`./components/page/jsons/${folderLanguageCurrent}create_account.json`);
                                },
                                getCampaign,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('about', {
                            url: "/about",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })                        
                        .state('education', {
                            url: "/education",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('faq', {
                            url: "/faq/:faq",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('account', {
                            url: "/account/:account/:accountActivity",
                            params: {
                                account: "Account Settings",
                                accountSettings: "Trading Activity"
                            },
                            template: "<page data='stateData'></page>",
                            resolve: {
                                setPromoCode,
                                loggedinPage: (userService, authService, $q, $state, loadingFrameService) => {
                                    if (!userService.userData.loginTried) {
                                        loadingFrameService.stopLoading();
                                        return authService.isUserLogging().then(() => true).catch(() => $state.go(`home`));
                                    } else {
                                        return authService.isUserLogging().then(() => true).catch(() => $q.reject());
                                    }
                                },
                                pageResolver: (resolutionChecker, sitelanguageService) => {
                                    folderLanguageCurrent=sitelanguageService.getLanguage();
                                    if (resolutionChecker.isMobile())
                                        return require(`./components/page/jsons/${folderLanguageCurrent}account-mobile.json`);
                                    else if (resolutionChecker.isTablet() || resolutionChecker.isSmallTablet())
                                        return require(`./components/page/jsons/${folderLanguageCurrent}account-tablet.json`);
                                    else
                                        return require(`./components/page/jsons/${folderLanguageCurrent}account.json`);
                                },
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('logout', {
                            //template: "<page data='stateData'></page>",
                            url: "/logout",
                            resolve: {
                                setPromoCode,
                                pageResolver: (authService, $state, $location, $q, loadingFrameService) => {
                                    loadingFrameService.startLoading();
                                    // TODO: add the option to logout to login page with stage go.
                                    authService.isUserLogging().then(() => {
                                        authService.loggingOut().then(() => {
                                            if (typeof $location.$$search.login !== 'undefined') {
                                                $state.go('login');
                                            } else {
                                                $state.go('home');
                                            }
                                        });
                                    }).catch(() => {
                                        if (typeof $location.$$search.login !== 'undefined') {
                                            $state.go('login');
                                        } else {
                                            $state.go('home');
                                        }
                                    });
                                    //$state.go('home');
                                    //return $q.reject();
                                },
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('latest_news', {
                            url: "/latest_news/:latest_news",
                            template: "<page data='stateData'></page>",
                            resolve: {                               
                                setPromoCode,
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"

                        })
                        .state('legal', {
                            url: "/legal",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver: (resolutionChecker, sitelanguageService) => {
                                    folderLanguageCurrent=sitelanguageService.getLanguage();
                                    if (resolutionChecker.isMobile()) {
                                        return require(`./components/page/jsons/${folderLanguageCurrent}legal-mobile.json`);
                                    } else
                                        return require(`./components/page/jsons/${folderLanguageCurrent}legal.json`);
                                },
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('verification_guide', {
                            url: "/verification_guide",
                            resolve: { 
                                setPromoCode,
                                pageResolver: ($window, $q) => {
                                    $window.open('https://www.hedgestonegroup.com/assets/guides/Verification_Guide.pdf', '_blank');
                                    return $q.reject()
                                },
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('article', {
                            url: "/article/:category/:name",
                            params: {
                                id: null,
                                category: null,
                                action: null,
                                name: null
                            },
                            template: "<page data='stateData'></page>",
                            resolve: {
                                setPromoCode,
                                pageResolver,
                                blockCountry,
                                verifyStateParams
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('video', {
                            url: "/video/:category/:name",
                            params: {
                                id: null,
                                category: null,
                                action: null,
                                name: null
                            },
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver,
                                blockCountry,
                                verifyStateParams
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('tools', {
                            url: "/tools:section",
                            template: "<page data='stateData'></page>",
                            resolve: {
                                setPromoCode,
                                pageResolver,
                                blockCountry
                            },
                            params: {
                                section: ""
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('guides', {
                            url: "/guides",
                            template: "<page data='stateData'></page>",
                            resolve: {
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('download', {
                            template: "<page data='stateData'></page>",
                            resolve: {
                                setPromoCode,
                                pageResolver: ($q, $window, popupsService, loadingFrameService) => {
                                    if ($window.navigator.platform === 'iPhone' || $window.navigator.platform === 'iPad') {
                                        popupsService.popItUp({
                                            type: 'popup',
                                            settemplate: 'custom',
                                            headline: 'We\'re Sorry',
                                            content: "The iOS mobile application is not available.<br/> <b>Coming Soon!</b>"
                                        });
                                    } else {
                                        $window.open(mobileAppUrl);
                                    }
                                    loadingFrameService.stopLoading();
                                    return $q.reject();
                                }
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('404', {
                            url: "/404",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver: ($q, userService, $state, $timeout) => {                                                                        
                                    
                                    $timeout(() => {
                                        if (userService.userData.isUserLogin) {
                                            $state.go('trade');
                                        } else {
                                            $state.go('login');
                                        }
                                    }, 0);
                                    return $q.reject();
                                }
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        .state('bonus_policy', {
                            url: "/bonus_policy",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver,
                                blockCountry
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        })
                        // .state('promotion', {
                        //     url: "/promotion",
                        //     template: "<page data='stateData'></page>",
                        //     resolve: {
                        //         pageResolver,
                        //         blockCountry
                        //     },
                        //     controller: controllerRef,
                        //     controllerAs: "state"
                        // })
                        .state('withdrawal', {
                            url: "/withdrawal",
                            template: "<page data='stateData'></page>",
                            resolve: {                                
                                setPromoCode,
                                pageResolver,
                                blockCountry,
                                loggedinPage: (userService, authService, $q, $state, loadingFrameService) => {
                                    if (!userService.userData.loginTried) {
                                        loadingFrameService.stopLoading();
                                        return authService.isUserLogging().then(() => true).catch(() => $state.go('home'));
                                    } else {
                                        return authService.isUserLogging().then(() => true).catch(() => $q.reject());
                                    }
                                }
                            },
                            controller: controllerRef,
                            controllerAs: "state"
                        });
            }]);
