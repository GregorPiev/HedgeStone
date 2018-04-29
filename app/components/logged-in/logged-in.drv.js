/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import './logged-in.less';

export default angular.module('app.page.loggedIn', [])
    .directive('loggedIn', loggedInConfig);

function loggedInConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./logged-in.tpl.html'),
        controller: loggedInController,
        controllerAs: 'loggedIn'
    }
}

class loggedInController {
    constructor($scope, userService, domFactory) {
        this.userLoggedIn = false;
        $scope.$watch(() => userService.userData.isUserLogin, (watchLogin) => {
            this.userLoggedIn = watchLogin;
        });
        this.loggedInData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.loggedInData, 'loggedIn', 'loggedInData');
    }
}