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
            inputData: '=',
            formData: '='
        },
        template: require('./ng-file-upload.tpl.html'),
        controller: NgInputController,
        controllerAs: 'ngFileUpload'
    }
}

class NgInputController {
    constructor($scope, $rootScope, $timeout) {
        this.input = $scope.inputData;
        this.thumb = `Drop pdfs or images here or click to upload`;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.$scope = $scope;
        this.inputInit();
    }

    inputInit() {
        this.$timeout(()=> {
            this.$rootScope.$broadcast(this.input.name + 'IsReady');
            this.form = this.$scope.formData;            
        });
        let self = this
        this.$scope.$watch(() => this.input.model, (newVal) => {
            if(newVal){
                this.thumb = newVal.name;
            } else {
                this.thumb = `Drop pdfs or images here or click to upload`;
            }
        })
    }

    isDefined(someVar) {
        if(typeof someVar === 'undefined')
            return 'Drop pdfs or images here or click to upload';
        return someVar;
    }
}