/**
 * Created by saar on 14/04/16.
 */

import "./ng-checkbox.less"


export default angular.module('ngCheckbox', [])
    .directive('ngCheckbox', ngCheckboxConfig);

function ngCheckboxConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ng-checkbox.tpl.html'),
        controller: NgCheckboxController,
        controllerAs: 'ngCheckbox'
    }
}

class NgCheckboxController {
    constructor($scope, $rootScope, $timeout) {
        this.data = $scope.data;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.inputInit();
    }

    inputInit() {
        this.isRequired();
        this.$timeout(()=> {
            this.$rootScope.$broadcast(this.data.name + 'IsReady');
        }, 0);
    }

    isDefined(someVar) {
        if(typeof someVar === 'undefined')
            return false;
        return true;
    }

    isRequired() {
        if(typeof this.required === 'undefined')
            this.required = false;
    }
}