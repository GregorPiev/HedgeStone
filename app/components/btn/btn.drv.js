/*
 Created by bnaya on 28/01/16, 
 @Component Name: btn.drv
 @Description: The button component
 @Params: 
 @Return: 
 @Methods: 
*/

import './btn.less';

export default angular.module('page.section.btn', [])
    .directive('btn', btnConfig);

function btnConfig() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            data: '=',
            btnFunction: '=',
            uniDirection: '=?'
        },
        template: require('./btn.tpl.html'),
        controller: btnController,
        controllerAs: 'btn'
    }
}

class btnController {
    constructor($scope, $state, popupsService, $window, userService, $rootScope, $anchorScroll, $location, btnsService, localStorageService) {
        this.btnFunction = $scope.btnFunction;
        this.popupsService = popupsService;
        this.btnData = $scope.data;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$scope = $scope;
        this.$anchorScroll = $anchorScroll;
        this.$location = $location;
        this.btnsService = btnsService;
        this.localStorageService = localStorageService;
        // this.$scope.uniDirection = false;
        this.userService = userService;
    }

    // go to state inside the app
    goToPage(destination) {
            this.$state.go(destination);
    }

    // go to external link
    goToLink(link, target) {       
        this.$window.open(link, '', (target == 'window') ? 'width=500px, height=400px' : '');
    }

    goToAnchor(anchor) {
        this.$location.hash(anchor);
        this.$anchorScroll();
    }
    
    // add icon to the button
    iconExist() {
        return typeof this.btnData.icon !== 'undefined'; // maybe add to comparison type of icons?
    }
    
    // add icon to the button
    secondIconExist() {
        return typeof this.btnData.secondIcon !== 'undefined'; // maybe add to comparison type of icons?
    }

    // decide which action to perform when clicking on the btn
    goTo() {
        if(!_.isUndefined(this.btnData.destination)) {
            this.goToPage(this.btnData.destination);
        } else if(!_.isUndefined(this.btnData.link)) {
            this.goToLink(this.btnData.link);
        } else if(!_.isUndefined(this.btnData.anchor)) {
            this.goToAnchor(this.btnData.anchor);
        } else if(!_.isUndefined(this.btnData.function)) {
            this.btnsService[this.btnData.function](this.btnData.functionParams);
        }

        if(typeof this.btnFunction !== 'undefined') {
            this.btnFunction();
        }
    }
}