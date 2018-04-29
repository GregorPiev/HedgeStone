/*
 Created by bnaya on 28/01/16,
 @Component Name: tradingActivityTable.drv
 @Description: Acting as a <div> HTML tag
 @Params:
 @Return:
 @Methods:
*/

import './trading-activity-table.less';

export default angular.module('app.section.tradingActivityTable', ['datatables', 'datatables.buttons', 'datatables.columnfilter'])
    .directive('tradingActivityTable', tradingActivityTableConfig);

function tradingActivityTableConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./trading-activity-table.tpl.html'),
        controller: TradingActivityTableController,
        controllerAs: 'tradingActivityTable'
    }
}

class TradingActivityTableController {
    constructor($scope, DTOptionsBuilder, DTColumnBuilder, $timeout, originService, $q, $http, $compile) {
        let self = this;
        this.$q = $q;
        this.$scope = $scope;
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.tradingActivityTableData = $scope.data;
        this.instance = {};
        this.checkboxs = {};
        this.dataTable = $http.post(`${originService.apiUrl}/api/layer/getTradingActivity`);

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
                //self.addClassStatus();
                //self.onReorder();
                //self.onSearch();
                self.createFilters();
                self.addDateFilter();
            });

        // Config datatable columns
        this.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#'),
            DTColumnBuilder.newColumn('Amount').withTitle('Amount'),
            DTColumnBuilder.newColumn('Payout').withTitle('Payout'),
            DTColumnBuilder.newColumn('Position').withTitle('Position'),
            DTColumnBuilder.newColumn('Option Id').withTitle('Option Id'),
            DTColumnBuilder.newColumn('Asset Name').withTitle('Asset Name'),
            DTColumnBuilder.newColumn('Status').withTitle('Status').withClass('Status'),
            DTColumnBuilder.newColumn('Executed').withTitle('Executed'),
            DTColumnBuilder.newColumn('Expired').withTitle('Expired'),
            DTColumnBuilder.newColumn('Start').withTitle('Start'),
            DTColumnBuilder.newColumn('Close').withTitle('Close'),
            DTColumnBuilder.newColumn('Percentage').withTitle('Percentage')
        ];
    }

    createFilters() {
        let filtersArr = this.$scope.data.filters;
        let elements = `<div class="filters">`;
        angular.forEach(filtersArr, (value, key) => {
            this.checkboxs[value] = true;
            elements += `<label><input type="checkbox" id="${value}" class="filter" ng-model="tradingActivityTable.checkboxs.${value}" ng-click="tradingActivityTable.updateTable($event)">${value}</label>`;
        });
        elements += `</div>`;
        let filters = $(`.${this.tradingActivityTableData.class} .dataTables_filter`).append(this.$compile(elements)(this.$scope));
        this.$timeout(() => {
            this.updateTable(this.dataTable);
        })
    }

    updateTable(event) {
        let filterRules = [];
        let dateFilter = this.tradingActivityTableData.dateFilter.id.split(',');
        angular.forEach(this.checkboxs, (value, key) => {
            if(value)
                filterRules.push(key.toLowerCase());
        });
        this.$q.when(this.dataTable).then((res) => {
            let deferred = this.$q.defer();
            let filteredData = _.filter(res.data, (data) => {
                return (_.indexOf(filterRules, data.Status) > -1);
            });
            filteredData = _.filter(filteredData, (data) => {
                let expired = this.phpDateToTimestamp(data.Executed, '/');               
                return (expired < Number(dateFilter[0]) && expired > Number(dateFilter[1]));
            });
            deferred.resolve(filteredData);
            this.instance.changeData(deferred.promise);
            //this.$timeout(() => {
            //    this.addClassStatus();
            //});
        });
    }

    //addClassStatus() {
    //    $(`.${this.tradingActivityTableData.class} tbody tr[role=row]`)
    //        .each(function(index, elem) {
    //            let tds = $(elem).children()[$(elem).find('.Status').index()];
    //            $(this).addClass($(tds).html());
    //        });
    //}

    //onSearch() {
    //    let self = this;
    //    var elem = $(`.${this.tradingActivityTableData.class} input[type=search]`);
    //
    //    // Save current value of element
    //    elem.data('oldVal', elem.val());
    //
    //    // Look for changes in the value
    //    elem.bind("propertychange change keyup input paste", function(event){
    //        // If value has changed...
    //        if (elem.data('oldVal') != elem.val()) {
    //            // Updated stored value
    //            elem.data('oldVal', elem.val());
    //            self.addClassStatus();
    //            self.onReorder();
    //        }
    //    });
    //}

    //onReorder() {
    //    let self = this;
    //    $(`.${this.tradingActivityTableData.class} .paginate_button, thead tr[role=row]`).click(function() {
    //        setTimeout(() => {
    //            self.addClassStatus();
    //            self.onReorder();
    //        }, 0);
    //    })
    //}

    searchInit() {
        let input = $(`.${this.tradingActivityTableData.class} input[type=search]`);
        $(`.${this.tradingActivityTableData.class} .dataTables_filter`).empty().append(input);
        $(`.${this.tradingActivityTableData.class} input[type=search]`).attr('placeholder', 'Search...');
    }

    phpDateToTimestamp(date, symbol = `-`) {
        let myDate = date;
        myDate = myDate.split(" ");
        myDate[0]=myDate[0].split(symbol);
        let year = (myDate[0][2].length === 2) ? `20${myDate[0][2]}` : myDate[0][2];
        let newDate =`${myDate[0][1]}/${myDate[0][0]}/${year}`;
        if(!_.isUndefined(myDate[1]))
            newDate += ` ${myDate[1]}`;
        return new Date(newDate).getTime();
    }

    //2016-06-29 08:40:27

    addDateFilter() {
        this.tradingActivityTableData.dateFilterArr = [];
        let countBack = (daysCountBack, day) => {
            let today = new Date();
            return today.setDate(day - daysCountBack);
        };
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let select = `<select
            class="dateFilter" ng-model="tradingActivityTable.tradingActivityTableData.dateFilter"
            ng-options="option as option.label for option in ::tradingActivityTable.tradingActivityTableData.dateFilterArr track by option.id"
            ng-change="::tradingActivityTable.updateTable()">`;
        let year = new Date().getFullYear();
        let month = new Date().getMonth()+1;
        let day = new Date().getDate();
        let today = new Date();
        this.tradingActivityTableData.dateFilterArr.push({
            "id": `${today.getTime()},${countBack(30, day)}`,
            "label": `Last 30 days`,
            "subItem": { "name": `Last 30 days` }
        });

        _.times(12, (index) => {
            if (month-1 === 0) {
                month = 13;
                year--;
            }
            let endDate = new Date(`${month}/1/${year}`);
            let startDate = new Date(`${month-1}/1/${year}`);
            this.tradingActivityTableData.dateFilterArr.push({
                "id": `${endDate.getTime()},${startDate.getTime()}`,
                "label": `${monthNames[month-2]} ${year}`,
                "subItem": { "name": `${monthNames[month-2]} ${year}` }
            });
            month--;
        });
        this.tradingActivityTableData.dateFilter = this.tradingActivityTableData.dateFilterArr[0];
        $(`.${this.tradingActivityTableData.class} .dataTables_filter`).append(this.$compile(select)(this.$scope));
        this.$scope.$digest();
        this.$timeout(() => {
            this.updateTable(this.dataTable);
        });
    }
}
