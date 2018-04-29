/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
 */

import './ng-image.less';

export default angular.module('page.section.ngImage', [])
    .directive('ngImage', ngImageConfig);

function ngImageConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ng-image.tpl.html'),
        controller: ngImageController,
        controllerAs: 'ngImage'
    }
}


class ngImageController {
    constructor($scope, originService) {
        this.ngImageData = $scope.data;
        if(!_.includes(this.ngImageData.src, 'http'))
            this.ngImageData.src = `${originService.originUrl}/${this.ngImageData.src}`;
        // attach the domain to images that belongs to the site, do noting for images for external sites. used for pre-rendering
    }
}