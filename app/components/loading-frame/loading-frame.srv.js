/**
 * Created by saar on 16/05/16.
 * @Description: Start/Stop the loading frame.
 */

export class LoadingFrame {
    constructor($rootScope, $timeout, popupsService, $state) {
        'ngInject';
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.popupsService = popupsService;
        this.$state = $state;
        this.loading = false;
        this.loadingWithId = [];
    }

    stopLoading(id) {
        if(_.isEmpty(this.loadingWithId)) {
            this.loading = false;
            this.$rootScope.$broadcast('loading', false);
        } else if(_.indexOf(this.loadingWithId, id) > -1) {
            this.loadingWithId.splice(_.indexOf(this.loadingWithId, id), 1);
            if(_.isEmpty(this.loadingWithId)) {
                this.loading = false;
                this.$rootScope.$broadcast('loading', false);
            }
        }

        this.$timeout.cancel(this.timer);
    }

    startLoading(id, timer) {
        let _timer = timer || 60000;
        this.$rootScope.$broadcast('loading', true);
        if(!_.isUndefined(id))
            this.loadingWithId.push(id);
        if(!this.loading) {
            this.timer = this.$timeout(() => {
                this.popupsService.popItUp({
                    settemplate: 'custom',
                    type: 'popup',
                    headline: 'Failed to Load Page',
                    content: 'We are experiencing problems with loading the web page at the moment. Please, click the "Retry" button to reload. <br>In case you continue experiencing problems with loading this page, please, contact our customer support team at support@hedgestonegroup.com.<br>Thank you.',
                    yesbtntitle: 'contact us',
                    nobtntitle: 'retry',
                    cancel: function () {
                        this.popupsService.popItDown();
                    },
                    no: function () {
                        this.$state.reload();
                        this.popupsService.popItDown();                        
                    },
                    yes: function () {
                        this.popupsService.popItDown();
                        this.$state.go('about');
                    }
                });
            }, _timer);
        }
        this.loading = true;
    }
}