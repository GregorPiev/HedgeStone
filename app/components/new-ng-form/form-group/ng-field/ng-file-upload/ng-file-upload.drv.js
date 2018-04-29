/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngFileUpload.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
*/
import './ng-file-upload.less';
import 'ng-file-upload';

export default angular.module('fileUpload', ['ngFileUpload'])
    .directive('ngFileUpload', ngFileUploadConfig);

function ngFileUploadConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ng-file-upload.tpl.html'),
        controller: NgInputController,
        controllerAs: 'ngFileUpload'
    }
}

class NgInputController {
    constructor($scope, $rootScope, $timeout) {
        this.ngFileUploadData = {};
        this.thumb = `No file selected`;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.$scope = $scope;
        this.inputInit();
    }

    inputInit() {
        let self = this;
        let params = {
            isOptionalValid: false
        }
        let fieldObj = _.findKeyInObj(this.$scope.$parent.data, 'element');
        this.$scope.$watch(() => this.ngFileUploadData['ng-model'], (newVal) => {
            if(newVal){
                if(!(/\.(gif|jpg|jpeg|png|bmp)$/i).test(newVal.name)) {
                    params.message = 'Please upload graphics files only: jpg, jpeg, png, bmp or gif)';
                    this.$rootScope.$broadcast(`${fieldObj[0].attrs.name}GenericValid`, params);
                    this.thumb = `No file selected`;
                } else {
                    if(newVal.size > 15000000) {
                        params.message = 'File must not exceed 15MB.';
                        this.$rootScope.$broadcast(`${fieldObj[0].attrs.name}GenericValid`, params);
                        this.thumb = `No file selected`;
                    } else {
                        this.thumb = newVal.name.length > 13 ? `${newVal.name.slice(0, 13)}...` : newVal.name;
                        fieldObj[0].dynamicAttrs['ng-model'] = newVal;
                    }
                }

            } else {
                this.thumb = `No file selected`;
                fieldObj[0].dynamicAttrs['ng-model'] = "";
            }
        });
    }
}