/**
 * Created by saar on 27/04/16.
 * @Description: define what a client who's not logged in will see.
 */

import './anonymous.less';

export default angular.module('app.page.anonymous', [])
    .directive('anonymous', anonymousConfig);

function anonymousConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./anonymous.tpl.html'),
        controller: anonymousController,
        controllerAs: 'anonymous'
    }
}

class anonymousController {
    /**
     * Watch for a fired event when user logged into the site.
     * In this case this component will not show its data.
     */
    constructor($scope, userService, domFactory) {
        this.userLoggedIn = false;
        $scope.$watch(() => userService.userData.isUserLogin, (userLoggedIn) => {
            this.userLoggedIn = userLoggedIn; // when this variable is true, the HTML of this component will be hidden.
        });
        this.anonymousData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.anonymousData, 'anonymous', 'anonymousData');
    }
}