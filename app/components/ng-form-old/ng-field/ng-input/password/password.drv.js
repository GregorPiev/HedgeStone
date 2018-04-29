/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/


export default angular.module('ngInput.password', [])
    .directive('password', passwordConfig);

function passwordConfig($rootScope) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function (val) {
                $rootScope.$broadcast('confirmPassword', val);
            });

        }
    };
}