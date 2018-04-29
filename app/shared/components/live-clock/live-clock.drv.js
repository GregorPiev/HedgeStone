import './live-clock.less';
import 'angular-clock';

export default angular.module('app.page.live-clock', ['ds.clock'])
    .directive('liveClock', liveClockConfig);

function liveClockConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./live-clock.tpl.html'),
        controller: liveClockController,
        controllerAs: 'liveClock'
    }
}

class liveClockController {
    constructor($scope, $timeout, $state) {
        this.time = `hh:mm:ss a`; // time format
        this.data = $scope.data;

        $scope.$on('scrolledDown', () => {
            this.up = true;
            $scope.$digest();
        });

        $scope.$on('$stateChangeStart', () => {
            this.up = false;
            $timeout(() => {
                this.inHomePage = ($state.current.name === 'home' || $state.next.name === 'home');
                $scope.$digest();
            }, 0);
        });

        $scope.$on('tickerReady', () => {
            $timeout(() => {
                this.up = true;
                $scope.$digest();
            }, 7000);
        });
    };
}