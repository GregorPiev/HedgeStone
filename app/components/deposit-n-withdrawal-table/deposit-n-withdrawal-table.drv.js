/*
 Created by bnaya on 28/01/16, 
 @Component Name: depositAndWithdrawalTable.drv
 @Description: Acting as a <div> HTML tag
 @Params: 
 @Return: 
 @Methods: 
*/

import './deposit-n-withdrawal-table.less';

export default angular.module('app.section.depositAndWithdrawalTable', ['datatables', 'datatables.buttons', 'datatables.columnfilter'])
    .directive('depositAndWithdrawalTable', depositAndWithdrawalTableConfig);

function depositAndWithdrawalTableConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./deposit-n-withdrawal-table.tpl.html'),
        controller: DepositAndWithdrawalTableController,
        controllerAs: 'depositAndWithdrawalTable'
    }
}

class DepositAndWithdrawalTableController {
    constructor($scope, DTOptionsBuilder, DTColumnBuilder, $timeout, originService, $q, $http, $compile) {
        let self = this;
        this.$q = $q;
        this.$scope = $scope;
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.depositAndWithdrawalTableData = $scope.data;
        this.instance = {};
        this.checkboxs = {};
        this.dataTable = $http.post(`${originService.apiUrl}/api/layer/getDepositAndWithdrawal`);

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
            .withDOM('frtip')
            .withOption('initComplete', function (){
                self.searchInit();
                // self.onReorder();
                // self.onSearch();
                self.createFilters();
                // self.addClassStatus();
            });


        // Config datatable columns
        this.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('Transaction Type').withTitle('Transaction Type'),
            DTColumnBuilder.newColumn('Method').withTitle('Method'),
            DTColumnBuilder.newColumn('Date Submited').withTitle('Date Submited'),
            DTColumnBuilder.newColumn('Date Processed').withTitle('Date Processed'),
            DTColumnBuilder.newColumn('Amount').withTitle('Amount'),
            DTColumnBuilder.newColumn('Status').withTitle('Status').withClass('Status')
        ];
    }

    createFilters() {
        let filtersArr = this.$scope.data.filters;
        let elements = `<div class="filters">`;
        angular.forEach(filtersArr, (value, key) => {
            this.checkboxs[value] = true;
            elements += `<label><input type="checkbox" id="${value}" class="filter" ng-model="depositAndWithdrawalTable.checkboxs.${value}" ng-click="depositAndWithdrawalTable.updateTable($event)">${value}</label>`;
        });
        elements += `</div>`;
        let filters = $(`.${this.depositAndWithdrawalTableData.class} .dataTables_filter`).append(this.$compile(elements)(this.$scope));
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
            $(`.${this.depositAndWithdrawalTableData.class} tbody tr[role=row]`)
                .each(function(index, elem) {
                    let tds = $(elem).children()[$(elem).find('.Status').index()];
                    $(this).addClass($(tds).html());
                });
        });
    }

    onSearch() {
        let self = this;
        var elem = $(`.${this.depositAndWithdrawalTableData.class} input[type=search]`);

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
            $(`.${this.depositAndWithdrawalTableData.class} .paginate_button, .${this.depositAndWithdrawalTableData.class} thead tr[role=row]`).click(function() {
                setTimeout(() => {
                    self.addClassStatus();
                    self.onReorder();
                }, 0);
            })
        });
    }

    searchInit() {
        let input = $(`.${this.depositAndWithdrawalTableData.class} input[type=search]`);
        $(`.${this.depositAndWithdrawalTableData.class} .dataTables_filter`).empty().append(input);
        $(`.${this.depositAndWithdrawalTableData.class} input[type=search]`).attr('placeholder', 'Search...');
    }
}