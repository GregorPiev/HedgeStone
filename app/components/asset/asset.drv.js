/*
 @Component Name: asset.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/

import './asset.less';

export default angular.module('app.page.section.asset', [])
    .directive('asset', assetConfig);

function assetConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./asset.tpl.html'),
        controller: assetController,
        controllerAs: 'asset'
    }
}

class assetController {
    constructor($scope, domFactory) {
        this.assetData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.assetData, 'asset', 'assetData');
    }
}