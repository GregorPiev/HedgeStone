/**
 * Created by saar on 16/05/16.
 * @Description: The loading frame for hiding the build of the DOM.
 */

import './loading-frame.less';


export default angular.module('app.loading', [])
    .directive('loadingFrame', loadingFrameConfig);


function loadingFrameConfig () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        template: require('./loading-frame.tpl.html'),
        controller: loadingFrameController,
        controllerAs: 'loadingFrame'
    }
}

class loadingFrameController {
    constructor($scope, loadingFrameService) {
        this.isLoading = false;
        this.loadingFrameService = loadingFrameService;

        /**
         * Listening to the event broadcast to start the loading frame.
         */
        $scope.$on('loading', (event, loading) => {
            this.isLoading = loading;
        });

        // Stop loading if the page did not load after 30 seconds.
        
    }
}


