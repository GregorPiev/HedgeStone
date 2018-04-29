/*
 Created by bnaya on 28/01/16, 
 @Component Name: formGroup.drv
 @Description: Wrapping ng-form directive with data.
 @Params: 
 @Return: 
 @Methods: 
*/

import ngField from './ng-field/ng-field.drv';
import ngMsgBox from './ng-msg-box/ng-msg-box.drv';
import ngLabel from './ng-label/ng-label.drv';
import './form-group.less';

export default angular.module('app.newForm.formGroup', [ngField.name, ngMsgBox.name, ngLabel.name])
    .directive('formGroup', formGroupConfig);

function formGroupConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./form-group.tpl.html'),
        controller: formGroupController,
        controllerAs: 'formGroup'
    }
}

class formGroupController {
    constructor($scope, domFactory, $timeout, $rootScope) {
        this.formGroupData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.formGroupData, 'formGroup', 'formGroupData');
        this.fieldData = _.findKeyInObj(this.formGroupData, 'ng-field');
        $scope.$watchCollection(() => this.field, (newVal) => {
            $scope.$broadcast(`${this.fieldData[0]['ng-field'].attrs.name}Changed`, newVal)
        });
        //$timeout(() => {
        //    $rootScope.$broadcast(`${this.fieldData[0]['ng-field'].attrs.name}IsReady`)
        //}, 500);
    }
}