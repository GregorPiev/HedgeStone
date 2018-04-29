/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngInput.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import './ng-input.less';

import confirmPassword from './confirm-password/confirm-password.drv';
import password from './password/password.drv';

export default angular.module('ngInput', [confirmPassword.name, password.name])
    .directive('ngInput', ngInputConfig);

function ngInputConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            inputData: '=',
            formData: '='
        },
        template: require('./ng-input.tpl.html'),
        controller: NgInputController,
        controllerAs: 'ngInput'
    }
}

class NgInputController {
    constructor($scope, $rootScope, $timeout, originService, userService, authService) {
        this.input = $scope.inputData;
        this.$rootScope = $rootScope;
        this.originService = originService;
        this.userService = userService;
        this.authService = authService;
        this.$timeout = $timeout;
        this.inputInit();
        this.$scope = $scope;
    }

    inputInit() {
        this.limiting();
        this.isInputRequired();
        this.isInputPattern();
        this.isInputMinlength();
        this.isInputMaxlength();
        //this.initDev();
        this.$timeout(()=> {
            this.$rootScope.$broadcast(this.input.name + 'IsReady');
            this.form = this.$scope.formData;
        });
    }

    limiting() {
        this.authService.isUserLogging().then(() => {
            if (this.userService.userData.userSession.testing) {
                this.input.min = 0;
            }
        });
    }

    initDev() {
        if(this.originService.isLocalEnv() || this.originService.isDevEnv()) {
            this.input.min = 1;
        }
    }

    isDefined(someVar) {
        if(typeof someVar === 'undefined')
            return false;
        return true;
    }

    isInputRequired() {
        if(typeof this.input.required === 'undefined')
            this.input.required = false;
    }

    isInputPattern() {
        if(typeof this.input.pattern === 'undefined') {
            this.input.pattern = false;
        }
    }

    isInputMinlength() {
        if(typeof this.input.minlength === 'undefined') {
            this.input.minLenght = false;
        }
    }

    isInputMaxlength() {
        if(typeof this.input.maxlength === 'undefined') {
            this.input.maxLenght = false;
        }
    }
}