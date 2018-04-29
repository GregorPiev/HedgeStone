/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
//import ngField from 'ng-field/ng-field.drv';

import './content.less';

export default angular.module('page.section.content', [])
    .directive('content', contentConfig);

function contentConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./content.tpl.html'),
        controller: contentController,
        controllerAs: 'content'
    }
}


class contentController {
    constructor($scope, domFactory) {
        this.contentData = $scope.data;
        this.html = "";
        this.html = domFactory.generateArray(this.contentData, 'content', 'contentData');
        
        if(typeof this.contentData.body !== 'undefined' || !_.isEmpty(this.contentData.body)) {
            angular.forEach(this.contentData.body, (value, key)=> {
                this.html += "<"+key+" data=\"content.contentData.body['"+key+"']\"></"+key+">";
            });
        }
    }
}