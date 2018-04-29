/**
 * Created by saar on 14/08/16.
 */

export class Birthday {
    constructor($rootScope) {
        'ngInject';
        this.$rootScope = $rootScope;
        this.month = '';
        this.year = '';
        this.options = {
            day: []
        }
    }

    setYear(year) {
        this.year = year;
    }

    setMonth(month) {
        this.month = month;
    }

    calculateDay() {
        if(this.year && this.month) {
            let monthLength = new Date(this.year, this.month, 0).getDate();
            this.options.day = [];
            let day = 1;
            for (let i = 0; i < monthLength; i++) {
                this.options.day.push({
                    "id": (i < 9) ? '0' + (day + i) : (day + i),
                    "label": (i < 9) ? '0' + (day + i) : (day + i),
                    "subItem": {"name": (i < 9) ? '0' + (day + i) : (day + i)}
                });
            }
            this.$rootScope.$broadcast('Days Ready');
            return this.options.day;
        } else {
            return false;
        }
    }

}