/*
 Created by bnaya on 28/01/16, 
 @Component Name: uiSelectWrapper.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
 */
import './ui-select-wrapperurl.less';

export default angular.module('uiSelectWrapperurl', [])
    .directive('uiSelectWrapperurl', uiSelectWrapperurlConfig);

function uiSelectWrapperurlConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ui-select-wrapperurl.tpl.html'),
        controller: UiSelectWrapperurlController,
        controllerAs: 'uiSelectWrapperurl'
    }
}

class UiSelectWrapperurlController {
    constructor($scope,$rootScope, resolutionChecker, languagesService, userService, $location,$state,localStorageService,originService) {
        this.uiSelectWrapperData = $scope.data;
        this.languagesService = languagesService;
        this.select = $scope.data;
        this.$scope = $scope;
        this.$rootScope = $rootScope; 
        this.originService = originService;
        this.localStorageService = localStorageService;
        this.userService = userService;
        this.resolutionChecker = resolutionChecker;
        this.$location = $location;
        this.$state = $state;
        this.initUiSelect();        
    }

    initUiSelect() {       
        
        this.languages = this.languagesService.getLanguages();        
        this.languages = _.sortBy(this.languages, (o) => o.name);
        
        let self = this;
        
        let chLang =String((this.$rootScope.language=='')?'GB':this.$rootScope.language).toUpperCase();
        chLang = chLang.split('/').join(chLang);
        self.select.selected = _.find(self.languages, {"code": chLang});       
        //self.select.selected = _.find(self.countries, {"code": 'ES'});
       
            
    }    
    
    getMedia(){
        return this.resolutionChecker.checkResolution() + "Class";
    }
    
    navigateTo(lang){        
        let currentProtocol = this.$location.$$protocol + "://";
        let newURL=currentProtocol;
        let url =(this.$location.$$url=='/')? '': this.$location.$$url;         
        if(lang==='/es'){
            newURL += this.originService.urlEspaniolSite + url;
        }else{
            newURL += this.originService.urlEnglishSite + url;
        }
        window.location.href = newURL;
        
    }
}





