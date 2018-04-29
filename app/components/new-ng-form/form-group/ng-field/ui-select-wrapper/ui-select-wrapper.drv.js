/*
 Created by bnaya on 28/01/16, 
 @Component Name: uiSelectWrapper.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
 */
import './ui-select-wrapper.less';

export default angular.module('uiSelectWrapper', [])
    .directive('uiSelectWrapper', uiSelectWrapperConfig);

function uiSelectWrapperConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./ui-select-wrapper.tpl.html'),
        controller: UiSelectWrapperController,
        controllerAs: 'uiSelectWrapper'
    }
}

class UiSelectWrapperController {
    constructor($scope, resolutionChecker, countriesService, userService) {
        this.uiSelectWrapperData = $scope.data;
        this.countriesService = countriesService;
        this.select = $scope.data;
        this.$scope = $scope;
        this.userService = userService;
        this.resolutionChecker = resolutionChecker;

        this.initUiSelect();
    }

    initUiSelect() {
        this.countries = this.countriesService.getCountries();        
        this.countries = _.sortBy(this.countries, (o) => o.code);
        // this.select.selected = {};
        let self = this;
        if(_.isEmpty(self.select.selected)) {
            this.userService.getUserGeoData().then((userGeoData) => {
                self.select.selected = _.find(self.countries, {"code": userGeoData.countryCode[0]});
                if (_.isUndefined(self.select.selected) || _.isEmpty(self.select.selected))
                    self.select.selected = _.find(self.countries, {"code": 'GB'});
            });
            // this.$scope.$watch(() => this.userService.userData.geoData, (userGeoData) => {
            //     if (typeof userGeoData !== 'undefined') {
            //         self.select.selected = _.find(self.countries, {"code": userGeoData.countryCode[0]});
            //         if (_.isUndefined(self.select.selected) || _.isEmpty(self.select.selected))
            //             self.select.selected = _.find(self.countries, {"code": 'GB'});
            //     }
            // });
        }
    }
}





