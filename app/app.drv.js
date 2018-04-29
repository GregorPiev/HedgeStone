import '../assets/less/general.less';
import './app.less';
import 'angular';
import 'angular-ui-router';
import 'angular-resource';
import 'angular-local-storage';
import 'angular-messages';
import 'angular-ui-bootstrap';
import 'angular-animate';
import 'angular-ui-select/select.min';
import 'angular-sanitize';
import 'angular-google-analytics';
import 'angular-datatables';
import './shared/utils';
import 'babel-polyfill';
import 'angular-recaptcha';
import '../../node_modules/angular-update-meta/dist/update-meta';
import '../assets/js/clickoutside.directive';
import 'angular-cookies';
import { LogsHandler } from './shared/services/logs-handler/logs-handler.srv';
import { ContentData } from './shared/services/content-data/content-data.srv';
import { TickerSocketsData } from './shared/services/sockets/ticker-socket.srv';
import { Origin } from './shared/services/origin/origin.srv';
import { Btns } from './shared/services/btns/btns.srv';
import { UserData } from './shared/services/user-data/user-data.srv';
import { Auth } from './shared/services/auth/auth.srv';
import { DepositThreeD } from './shared/services/depositThreeD/DepositThreeD.srv';
import { Deposit } from './shared/services/deposit/deposit.srv';
import { Popups } from './components/popups/popups.srv';
import { CountriesService } from './shared/services/countries/countries.srv';
import { LanguagesService } from './shared/services/languages/languages.srv';
import { DomGenerator } from './shared/services/dom-genereator/dom-generator.srv';
import { LoadingFrame } from './components/loading-frame/loading-frame.srv';
import { Withdrawal } from './shared/services/withdrawal/withdrawal.srv';
import { RequestHandler } from './shared/services/request-handler/request-handler.srv';
import { Birthday } from './shared/services/birthday/birthday.srv';
import { Sitelanguage } from './shared/services/sitelanguage/sitelanguage.srv';
import { ApiSocket } from './shared/services/sockets/api-socket.srv';
import { Bonus } from  './shared/services/bonus/bonus.srv';
import ngFixed from './shared/components/header/ng-fixed/ng-fixed.drv';
import './shared/providers/resolution/resolution.pvdr.js';
// import ngForm from './components/ng-form-old/ng-form.drv';
import './shared/services/logs-handler/logs-handler.srv.js';
//import ngForm from './components/ng-form/ng-form.drv';
import ngFormNew from './components/new-ng-form/ng-form.drv';
import page from './components/page/page.drv';
import header from './shared/components/header/header.drv';
import footer from './shared/components/footer/footer.drv';
import platform from './components/platform/platform.drv';
import popups from './components/popups/popups.drv';
import unsafeFilter from './shared/filters/unsafe.fltr';
import htmlToPlainFilter from './shared/filters/html-to-plain.fltr';
import loadingFrame from './components/loading-frame/loading-frame.drv';
import liveChat from './shared/components/live-chat/live-chat.drv';
import liveClock from './shared/components/live-clock/live-clock.drv';

import './app.less';
import './app.config';


var app = angular.module('app', ['ngResource', 'ui.router', 'vcRecaptcha', 'LocalStorageModule', 'ngAnimate', 'ngMessages', 'ui.bootstrap', 'angular-click-outside','ngCookies', page.name, header.name, footer.name, unsafeFilter.name, htmlToPlainFilter.name, platform.name, ngFixed.name, liveClock.name, 'ui.select', 'app.providers', 'angular-google-analytics', 'app.config', popups.name, loadingFrame.name, 'updateMeta', liveChat.name, ngFormNew.name]);

app.directive('app', appConfig);

function appConfig() {
    return {
        controller: AppController,
        controllerAs: 'app',
        template: require('./app.tpl.html'),
        replace: true
    }
}


class AppController {
    constructor(logsHandlerService, contentDataService, userService, authService, depositService, $sce, $window, $location, $rootScope, $document, popupsService, $scope,sitelanguageService) {
        'ngInject';
        this.authService = authService;
        this.depositService = depositService;
        this.contentDataService = contentDataService;
        this.$sce = $sce;
        this.$window = $window;
        this.tokenSuccess = false;

        // adds element to the document that defines the browser data
        $document[0].documentElement.setAttribute("data-browser", navigator.userAgent);

        // interface to test popups
        window.popup = (type, headline, content, btnTitle1, btnTitle2) => {
            popupsService.popItUp({
                type: 'popup',
                settemplate: type,
                headline: headline,
                yes: () => {
                    
                },
                no: () => {
                   
                },
                content: content,
                yesbtntitle: btnTitle1,
                nobtntitle: btnTitle2
            });
            $scope.$apply();
        };
    }
    
    continieMaintenance(){
        
    }
}



app.service('logsHandlerService', LogsHandler);
app.service('contentDataService', ContentData);
app.service('originService', Origin);
app.service('btnsService', Btns);
app.service('userService', UserData);
app.service('authService', Auth);
app.service('depositThreeDService', DepositThreeD);
app.service('depositService', Deposit);
app.service('popupsService', Popups);
app.service('loadingFrameService', LoadingFrame);
app.service('tickerSocketsService', TickerSocketsData);
app.service('withdrawalService', Withdrawal);
app.service('requestHandlerService', RequestHandler);
app.service('birthdayService', Birthday);
app.service('sitelanguageService', Sitelanguage);
app.service('apiSocketService', ApiSocket);
app.service('bonusService', Bonus);
app.factory('countriesService', () => new CountriesService);
app.factory('languagesService', () => new LanguagesService);
app.factory('domFactory', () => new DomGenerator());


angular.bootstrap(document, ['app'], {
    strictDi: true
});
