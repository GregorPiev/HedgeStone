/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/


export default angular.module('app.newForm.formGroup.ngField.genericValidation', [])
    .directive('genericValidation', genericValidationConfig);

function genericValidationConfig() {
    return {
        require: 'ngModel',
        scope: {
            genericValidation: '='
        },
        link: function(scope, elm, attrs, ctrl) {
            let generic = true;
            let oldValue;
            let event;
            let clear;
            let field = scope.genericValidation;
            ctrl.$validators.generic = function(modelValue, viewValue) {
                if(!generic && oldValue !== modelValue) {
                    generic = true;
                    ctrl.$optionalValid = false;
                    ctrl.$validate();
                }

                if (typeof clear === 'function')
                    clear();
                clear = scope.$on(`${field.attrs.name}ClearGenericValid`, (event, data) => {
                    generic = true;
                    ctrl.$valid = true;
                    ctrl.$optionalValid = false;
                    delete ctrl.$error.generic;
                    ctrl.$validate();
                });

                if (typeof event === 'function')
                    event();
                event = scope.$on(`${field.attrs.name}GenericValid`, (event, data) => {
                    if(_.isString(data))
                        data = {message: data};
                    if(_.isUndefined(data.isOptionalValid))
                        data.isOptionalValid = false;

                    field.msgBox.generic = data.message;
                    oldValue = modelValue;
                    generic = false;
                    ctrl.$valid = data.isOptionalValid;
                    ctrl.$optionalValid = data.isOptionalValid;
                    ctrl.$touched = true;

                    if(!data.isOptionalValid) {
                        ctrl.$validate();
                    } else {
                        ctrl.$error.generic = true;
                    }
                });
                return generic;
            }
        }
    }
}