/*
 Created by bnaya on 28/01/16, 
 @Component Name: ngSelect.drv
 @Description:
 @Params: 
 @Return: 
 @Methods: 
 */
import './ng-select.less';

export default angular.module('ngSelect', [])
    .directive('ngSelect', ngSelectConfig);

function ngSelectConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            selectData: '=',
            formData: '=',
            data: '='
        },
        template: require('./ng-select.tpl.html'),
        controller: NgSelectController,
        controllerAs: 'ngSelect'
    }
}

class NgSelectController {
    constructor($scope, $rootScope, $timeout, countriesService, userService, resolutionChecker) {
        if (typeof $scope.data !== 'undefined')
            this.select = $scope.data;
        else
            this.select = $scope.selectData;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.countriesService = countriesService;
        this.resolutionChecker = resolutionChecker;
        this.userService = userService;
        this.$scope = $scope;
        this.inputInit();
        if (this.select.type === 'ui-select') {
            this.initUiSelect();
        } else if (this.select.name === 'Year') {
            this.initYearSelect();
        } else if (this.select.name === 'expire_year') {
            this.initCcYearSelect();
        } else if (this.select.name === 'Day') {
            this.initDaySelect();
        } else if (this.select.name === 'Currency') {
            this.initCurrencySelect();
        }
    }

    initUiSelect() {
        this.countries = this.countriesService.getCountries();
        this.countries = _.sortBy(this.countries, (o) => o.code);
        this.select.selected = {};
        this.userService.getGeoData().then(() => {
            this.select.selected = _.find(this.countries, {"code": this.userService.userData.geoData.countryCode[0]});
            if (typeof this.select.selected === 'undefined') {
                this.select.selected = _.find(this.countries, {"code": 'GB'});
            }
        });
        // this.$scope.$watch(() => this.userService.userData.geoData, (userGeoData) => {
        //     if (typeof userGeoData !== 'undefined') {
        //         this.select.selected = _.find(this.countries, {"code": userGeoData.countryCode[0]});
        //         if (typeof this.select.selected === 'undefined')
        //             this.select.selected = _.find(this.countries, {"code": 'GB'});
        //
        //     }
        // });
    }

    initCurrencySelect() {
        this.userService.getDefaultCurrency().then((response) => {
            this.select.selected = _.find(this.select.options, {"label": response});
        });
    }

    initYearSelect() {
        this.$scope.$evalAsync(() => {
            let year = new Date().getFullYear();
            let fromYear = year - 17;
            let toYear = 96 - 17;
            for (let i = 0; i < toYear; i++) {
                this.select.options.push({
                    "id": fromYear - i,
                    "label": fromYear - i,
                    "subItem": {"name": fromYear - i}
                });
            }
        });
    }

    initCcYearSelect() {
        this.$scope.$evalAsync(() => {
            let year = new Date().getFullYear();
            for (let i = 0; i < 10; i++) {
                this.select.options.push({
                    "id": year + i,
                    "label": year + i,
                    "subItem": {"name": year + i}
                });
            }
        });
    }

    initDaySelect() {
        this.$scope.$evalAsync(() => {
            let day = 1, years = [];
            for (let i = 0; i < 31; i++) {
                years.push({
                    "id": (i < 9) ? '0' + (day + i) : (day + i),
                    "label": (i < 9) ? '0' + (day + i) : (day + i),
                    "subItem": {"name": (i < 9) ? '0' + (day + i) : (day + i)}
                });
            }
            this.select.options = years;
        });
    }

    inputInit() {
        this.$timeout(()=> {
            this.$rootScope.$broadcast(this.select.name + 'IsReady');
            this.form = this.$scope.formData;
        });
    }

    isDefined(isDefined) {
        if (typeof isDefined === 'undefined')
            return false;
        return true;
    }

    getCountryFlag(flag) {
        return `/countries/assets/${flag}`;
    }
}





