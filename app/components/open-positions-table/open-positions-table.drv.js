/*
 Created by bnaya on 28/01/16, 
 @Component Name: openPositionsTable.drv
 @Description: Acting as a <div> HTML tag
 @Params: 
 @Return: 
 @Methods: 
*/

import './open-positions-table.less';

export default angular.module('app.section.openPositionsTable', ['datatables', 'datatables.buttons', 'datatables.columnfilter'])
    .directive('openPositionsTable', openPositionsTableConfig);

function openPositionsTableConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./open-positions-table.tpl.html'),
        controller: OpenPositionsTableController,
        controllerAs: 'openPositionsTable'
    }
}

class OpenPositionsTableController {
    constructor($scope, DTOptionsBuilder, DTColumnBuilder, $timeout, originService, $q, $http, $compile) {
        let self = this;
        this.$q = $q;
        this.$scope = $scope;
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.openPositionsTableData = $scope.data;
        this.instance = {};
        this.checkboxs = {};
        this.dataTable = $http.post(`${originService.apiUrl}/api/layer/getOpenPositionsTable`);

        // Config datatable options
        this.dtOptions = DTOptionsBuilder
            .fromFnPromise(function() {
                return $q.when(self.dataTable).then((result) => {
                    angular.forEach(result.data, (value, key) => {
                        value['Amount'] = `${value['Amount']} ${value['Currency']}`;
                    });
                    return result.data;
                });
            })
            .withDOM('rtip')
            .withOption('initComplete', function (){
                // self.searchInit();
                // self.onReorder();
                // self.onSearch();
                // self.createFilters();
                // self.addClassStatus();
            });


        // Config datatable columns
        this.dtColumns = [
            DTColumnBuilder.newColumn('assetName').withTitle('The Asset'),
            DTColumnBuilder.newColumn('prediction').withTitle('Prediction').withClass('prediction').renderWith(function (data) {
                if(data === "put" || data === "call"){
                    return `<img src="assets/icons/${data}.png" />`;
                }
                return data;
            }),
            DTColumnBuilder.newColumn('expiration').withTitle('Expiration'),
            DTColumnBuilder.newColumn('investment').withTitle('Investment'),
            DTColumnBuilder.newColumn('potential_payout').withTitle('Payout')
        ];
    }

    createFilters() {
        let filtersArr = this.$scope.data.filters;
        let elements = `<div class="filters">`;
        angular.forEach(filtersArr, (value, key) => {
            this.checkboxs[value] = true;
            elements += `<label><input type="checkbox" id="${value}" class="filter" ng-model="openPositionsTable.checkboxs.${value}" ng-click="openPositionsTable.updateTable($event)">${value}</label>`;
        });
        elements += `</div>`;
        let filters = $(`.${this.openPositionsTableData.class} .dataTables_filter`).append(this.$compile(elements)(this.$scope));
        this.$timeout(() => {
            this.updateTable(this.dataTable);
        })
    }

    updateTable(event) {
        let filterRules = [];
        angular.forEach(this.checkboxs, (value, key) => {
            if(value)
                filterRules.push(key.toLowerCase());
        });
        this.$q.when(this.dataTable).then((res) => {
            let deferred = this.$q.defer();
            let filteredData = _.filter(res.data, (data) => {
                return (_.indexOf(filterRules, data.Status) > -1);
            });

            deferred.resolve(filteredData);
            this.instance.changeData(deferred.promise);
            this.$timeout(() => {
                this.addClassStatus();
                this.onReorder();
                this.onSearch();
            });
        });
    }

    addClassStatus() {
        this.$timeout(() => {
            $(`.${this.openPositionsTableData.class} tbody tr[role=row]`)
                .each(function(index, elem) {
                    let tds = $(elem).children()[$(elem).find('.Status').index()];
                    $(this).addClass($(tds).html());
                });
        });
    }

    onSearch() {
        let self = this;
        var elem = $(`.${this.openPositionsTableData.class} input[type=search]`);

        // Save current value of element
        elem.data('oldVal', elem.val());

        // Look for changes in the value
        elem.bind("propertychange change keyup input paste", function(event){
            // If value has changed...
            if (elem.data('oldVal') != elem.val()) {
                // Updated stored value
                elem.data('oldVal', elem.val());
                self.addClassStatus();
                self.onReorder();
            }
        });
    }

    onReorder() {
        this.$timeout(() => {
            let self = this;
            $(`.${this.openPositionsTableData.class} .paginate_button, .${this.openPositionsTableData.class} thead tr[role=row]`).click(function() {
                setTimeout(() => {
                    self.addClassStatus();
                    self.onReorder();
                }, 0);
            })
        });
    }

    searchInit() {
        let input = $(`.${this.openPositionsTableData.class} input[type=search]`);
        $(`.${this.openPositionsTableData.class} .dataTables_filter`).empty().append(input);
        $(`.${this.openPositionsTableData.class} input[type=search]`).attr('placeholder', 'Search...');
    }
}