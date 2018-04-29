/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

export default angular.module('app.ngFixed', [])
    .directive('ngFixed', ngFixedConfig);

function ngFixedConfig($window, resolutionChecker, $rootScope) {
    return {
        restrict: 'A',
        link: (scope, element) => {
            let offset = resolutionChecker.isMobile() ? 100 : 150;
            let animate = (animateClass) => {
                element[0].className += ` ${animateClass}`;
                setTimeout(() => {
                    element[0].className = element[0].className.replace(` ${animateClass}`, '');
                }, 1500);
            };
            let scroll = _.throttle(() => {
                if ($window.pageYOffset > offset) {
                    $rootScope.$broadcast('scrolledDown');
                    if (element[0].className.indexOf(' scrolling') == -1) {
                        animate('in');
                        element[0].className += ' scrolling';
                    }
                } else {
                    animate('out');
                    element[0].className = element[0].className.replace(' scrolling', '');
                }
            }, 100);
            $window.onscroll = scroll;
        }
    }
}