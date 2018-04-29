/*
 Created by bnaya on 28/01/16, 
 @Component Name: block.drv
 @Description: Acting as a <div> HTML tag
 @Params: 
 @Return: 
 @Methods: 
*/

import './block.less';

export default angular.module('app.page.block', [])
    .directive('block', blockConfig);

function blockConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./block.tpl.html'),
        controller: blockController,
        controllerAs: 'block'
    }
}

class blockController {
    constructor($scope, domFactory) {
        this.blockData = $scope.data;
        this.html = "";
        if(typeof this.blockData.background !== 'undefined') {
           this.blockData.backgroundStyle = {"background-image": 'url('+this.blockData.background+')', "background-position": "center"};
        }
        this.html = domFactory.generateArray(this.blockData, 'block', 'blockData');
    }
}