/**
 * Created by saar on 6/13/16.
 * @Component: live-chat.drv
 * @Description: live chat feature
 */

import './live-chat.less';

export default angular.module('app.live-chat', [])
    .directive('liveChat', liveChatConfig);

function liveChatConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        template: require('./live-chat.tpl.html'),
        controller: liveChatController,
        controllerAs: 'liveChat'
    }
}

class liveChatController {
    constructor($window, $rootScope, $scope, $timeout, $state, tickerSocketsService) {
        this.$window = $window;
        this.show = false;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;

        this.openBtn = {
            title: "live contact",
            svgIcon: {
                src: "assets/icons/icon-message.svg"
            },
            secondIcon: {
                class: "fa fa-plus"
            }
        };

        this.chatBtn = {
            title: "chat now"
        };

        this.callBtn = {
            title: "call",
            destination: "about"
        };

        this.shareBtn = {
            class: "btn btn-transparent share-screen",
            title: "share screen",
            link: "http://get.teamviewer.com/bvgvdhr",
            target: "window"
        };

        /**
         * On state change close the live chat btn.
         */
        $rootScope.$on('$stateChangeStart', () => {
            this.show = false;
            this.openBtn.secondIcon.class = "fa fa-plus";
        });

        $scope.$on('liveChat.close', () => {
            this.show = false;
            this.openBtn.secondIcon.class = "fa fa-plus";
        });

        $scope.$on('$stateChangeStart', () => {
            this.up = false;
            $timeout(() => {
                this.inHomePage = ($state.current.name === 'home' || $state.next.name === 'home');
                if(tickerSocketsService.ready) {
                    this.up = true;
                    $scope.$digest();
                };
                // $scope.$digest();
            }, 0);
        });

        $scope.$on('scrolledDown', () => {
            this.up = true;
            $scope.$digest();
        });

        $scope.$on('tickerReady', () => {
            $timeout(() => {
                this.up = true;
                $scope.$digest();
            }, 7000);
        });
    }

    /**
     * @Description: toggle the live chat
     */
    toggle() {
        this.$scope.uniDirection = !this.$scope.uniDirection; // bridge between the btn's scope and the live chat scope.
        this.$scope.uniDirection ? this.btnData.secondIcon.class = "fa fa-times" : this.btnData.secondIcon.class = "fa fa-plus";
    }

    chat() {
        this.$rootScope.$broadcast('liveChat.close');        
        this.$window.open('https://secure.livechatinc.com/licence/7458121/open_chat.cgi', 'new', `width=${this.$window.innerWidth/2}, height=${this.$window.innerHeight/2}`);
    }

    close() {
        this.$rootScope.$broadcast('liveChat.close');
    }
}
