/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngInput.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import ngInput from './ng-input/ng-input.drv';
import ngFileUpload from './ng-file-upload/ng-file-upload.drv';
import ngSelect from './ng-select/ng-select.drv';
import ngInputIcon from './ng-input-icon/ng-input-icon.drv';
import ngMsgBox from './ng-msg-box/ng-msg-box.drv';
import ngLabel from './ng-label/ng-label.drv';
import currencyList from  '../../../../assets/jsons/currency.json'
import './ng-field.less';

export default angular.module('ngField', [ngInput.name, ngInputIcon.name, ngMsgBox.name, ngSelect.name, ngLabel.name, ngFileUpload.name])
    .directive('ngField', ngFieldConfig);

function ngFieldConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            fieldData: '='
        },
        template: require('./ng-field.tpl.html'),
        controller: NgFieldController,
        controllerAs: 'ngField'
    }
}

class NgFieldController {
    constructor($scope, userService) {
        this.field = $scope.fieldData;
        if(this.field.withAddon) {
            let currency = _.find(currencyList, {"code" : userService.userData.userSession.currency});
            let symbol = currency ? currency.symbol : userService.userData.userSession.currency;
            this.field.addon = symbol;
        }
    }

    isDefined(someVar) {
        if(typeof someVar === 'undefined')
            return false;
        return true;
    }
}