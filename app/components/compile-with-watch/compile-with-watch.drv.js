export default angular.module('page.compileWithWatch', [])
    .directive('compileWithWatch', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(
                    function(scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compileWithWatch); // eval the expression on compile attribute.
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
                        }

                    }
                , true);
            }
        }
    });

