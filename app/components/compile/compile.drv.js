/*
 Created by bnaya on 28/01/16,
 @Component Name: page.drv
 @Description:
 @Params:
 @Return:
 @Methods:
*/
//import ngField from 'ng-field/ng-field.drv';

//export default angular.module('page.compile', [], function($compileProvider) {
//    $compileProvider.directive('compile', function($compile) {
//        return function(scope, element, attrs) {
//            var compileDOM = scope.$watch(
//                function(scope) {
//                    // watch the 'compile' expression for changes
//                    return scope.$eval(attrs.compile);
//                },
//                function(value) {
//                    // when the 'compile' expression changes
//                    // assign it into the current DOM
//                    element.html(value);
//
//                    // compile the new DOM and link it to the current
//                    // scope.
//                    // NOTE: we only compile .childNodes so that
//                    // we don't get into infinite loop compiling ourselves
//                    $compile(element.contents())(scope);
//                    compileDOM();
//                }
//            );
//        };
//    });
//
//
//});

export default angular.module('page.compile', [])
    .directive('compile', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var compileDOM = scope.$watch(
                    function(scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compile); // eval the expression on compile attribute.
                    },
                    function(value) {
                        if(!_.isUndefined(value) && !_.isEmpty(value)) { // Check for empty value.
                            // when the 'compile' expression changes
                            // assign it into the current DOM
                            element.html(value);

                            // compile the new DOM and link it to the current scope.
                            // NOTE: we only compile .childNodes so that
                            // we don't get into infinite loop compiling ourselves
                            $compile(element.contents())(scope);
                            compileDOM(); // Reset the watch to have 'Bind Once' watch.
                        }

                    }
                );
            }
        }
    });

