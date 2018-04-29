/**
 * Created by saar on 15/05/16.
 * @Description: The guide component.
 */


import './guide.less';

export default angular.module('app.section.guide', [])
    .directive('guide', guideConfig)

function guideConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./guide.tpl.html'),
        controller: guideController,
        controllerAs: 'guide'
    }
}

class guideController {
    constructor($scope, domFactory, $window) {
        this.guideData = $scope.data;
        this.$window = $window;
        this.html = '';
        this.html = domFactory.generateArray(this.guideData, 'guide', 'guideData');

        if(typeof this.guideData.background !== 'undefined') {
            this.guideData.backgroundStyle = {"background-image": 'url('+this.guideData.background+')', "background-position": "top", "background-repeat": "no-repeat"};
        }
    }

    /**
     * @Description: open the guide's pdf by its url. 
     */
    open() {
        this.$window.open(this.guideData.url);
    }
}