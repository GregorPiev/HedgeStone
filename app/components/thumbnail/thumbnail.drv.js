/**
 * Created by saar on 05/05/16.
 */

import './thumbnail.less'


export default angular.module('app.page.thumbnail', [])
    .directive('thumbnail', thumbnailConfig);

function thumbnailConfig () {
    return {
        restrict: 'E',
        replace: true,
        template: require('./thumbnail.tpl.html'),
        scope: {
            data: '='
        },
        controller: thumbnailController,
        controllerAs: 'thumbnail'
    }
}

class thumbnailController {
    constructor($scope, domFactory) {
        this.thumbnailData = $scope.data;
        this.html = '';
        this.html = domFactory.generateArray(this.thumbnailData, 'thumbnail', 'thumbnailData');
    }
}