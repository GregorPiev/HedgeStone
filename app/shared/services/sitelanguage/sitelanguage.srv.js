/**
 * Created by Gregori.
 */

export class Sitelanguage {
    constructor($rootScope,$location,originService) {
        'ngInject';
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.language = ''; 
        this.pathname='';
        this.originService = originService;
    }

    setLanguage() {                    
            if(window.location.host===this.originService.urlEspaniolSite){ 
                this.$rootScope.language = 'es';
                this.language = this.$rootScope.language + "/";
            }else{
                this.$rootScope.language ='';
                this.language = '';
            }
                
    }
    
   getLanguage(){       
        return this.language;        
    }

}