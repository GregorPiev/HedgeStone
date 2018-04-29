/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/


export default angular.module('ngInput.confirmPassword', [])
    .directive('confirmPassword', confirmPasswordConfig);

function confirmPasswordConfig() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            let password;
            scope.$on('confirmPassword', (event, data) => {
                password = data;
                ctrl.$validate();
            });

            ctrl.$validators.confirmPassword = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                if (modelValue == password) {
                    // it is valid
                    return true;
                }

                // it is invalid
                return false;
            };

        }
    }
}
