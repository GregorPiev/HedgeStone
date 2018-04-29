/*
 Created by bnaya on 28/01/16, 
 @Component Name: page.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
 */
import section from '../section/section.drv';
import compile from '../compile/compile.drv';
import compileWithWatch from '../compile-with-watch/compile-with-watch.drv';
import block from '../block/block.drv';
import loggedIn from '../logged-in/logged-in.drv';
import anonymous from '../anonymous/anonymous.drv';
import autoSubmit from '../auto-submit/auto-submit.drv';
import customIframe from '../custom-iframe/custom-iframe.drv';
import clock from '../clock/clock.drv';
import header from '../../shared/components/header/header-bottom.json';

import './page.less'

export default angular.module('page', [section.name, compile.name, block.name, loggedIn.name, anonymous.name, autoSubmit.name, customIframe.name, compileWithWatch.name, clock.name])
    .directive('page', pageConfig);

function pageConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./page.tpl.html'),
        controller: pageController,
        controllerAs: 'page'
    }
}


class pageController {
    constructor($scope, $state, $window, domFactory, resolutionChecker, $location ,$cookies) {
        this.$scope = $scope;
        this.pageData = $scope.data;
        this.$state = $state;
        this.$window = $window;
        this.domFactory = domFactory;
        this.resolutionChecker = resolutionChecker;
        this.domain = ($location.$$host === 'localhost') ? "" : $location.$$host;

        // this for fixed bottom header in every page. in order to restore the animation we need to write to header
        // config in each matching resolution json and delete those 2 lines of code.
        if(this.resolutionChecker.checkHeaderResolution() !== 'desktop')
            this.pageData.array.unshift(header);


        this.html = '';
        this.html += domFactory.generateArray(this.pageData, 'page', 'pageData');
        // this.updateOnResize();
        //document.cookie="utm_tracker=1; domain=.localhost; path=/"        
        
        //utm_tracker
        if($cookies.get('utm_tracker')===undefined){            
            let someDate = new Date();
            let numberOfDaysToAdd = 3; //Cookie to be existed.
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
            let someDateString =someDate.toUTCString();             
            
            
            if($location.search().utm_tracker){
                let cookieVal=$location.search().utm_tracker;                
                //$cookies.put('utm_tracker',cookieVal,{path:'/',expires: someDateString});
                document.cookie = "utm_tracker="+cookieVal+";domain=.hedgestonegroup.com;path=/;expires=" + someDateString +";";
            }    
        }
        
    }

    updateOnResize() {
        let self = this;
        angular.element(this.$window).bind('resize', function() {
            // self.updateByResomlution();
            // self.html = self.domFactory.generateArray(self.pageData, 'page', 'pageData');
            // self.$scope.$digest();
            // self.$state.reload();
        });
    }

    updateByResolution() {
        if (this.resolutionChecker.checkHeaderResolution() !== 'desktop' && _.isUndefined(_.find(this.pageData.array, header))) {
            this.pageData.array.unshift(header);
        } else if(this.resolutionChecker.checkHeaderResolution() === 'desktop' && !_.isUndefined(_.find(this.pageData.array, header))) {
            this.pageData.array.splice(0, 1);
        }
    }

    isTransparentHeader() {
        if(this.$state.includes('home'))
            return this.withHeader = false;
        if(this.$state.includes('promotion'))
            return this.withHeader = false;
        return this.withHeader = true;
    }
}