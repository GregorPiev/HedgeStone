/**
 * Created by saar on 04/05/16.
 * @Description: Account overview Widget containing details about the account
 *
 */
import './account-overview.less';

export default angular.module('app.page.section.accountOverview', [])
    .directive('accountOverview', accountOverviewConfig);

function accountOverviewConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./account-overview.tpl.html'),
        controller: accountOverviewController,
        controllerAs: 'accountOverview'
    }
}

class accountOverviewController {
    /**
     * @Description: building the widget and injecting the data to the DOM.
     * @param $scope
     * @param domFactory
     * @param userService
     * @param $timeout
     * @param loadingFrameService
     */
    constructor($scope, domFactory, userService, $timeout, loadingFrameService) {
        this.loadingFrameService = loadingFrameService;
        this.loadingFrameService.startLoading();
        this.accountOverviewData = $scope.data;
        this.userService = userService;
        this.$scope = $scope;
        this.html = "";
        this.html = domFactory.generateArray(this.accountOverviewData, 'accountOverview', 'accountOverviewData');

        /**
         * Use the service to get the data from the session.
         */
        this.userService.getPersonalUserData().then((response) => {
            // divide the data to variables.
            this.userAccountNumber = response.data.message['Account_Security_Information']['Account_Number'];
            this.userCreationDate = response.data.message['Account_Financial_Information']['Creation_Date'];

            // get the DOM elements
            this.accNo = document.getElementById('account_number');
            this.creationDate = document.getElementById('date');

            // inject the data to the elements.
            this.accNo.innerHTML = this.userAccountNumber;
            this.creationDate.innerHTML = this.userCreationDate;

            this.loadingFrameService.stopLoading();
        });
    }
}