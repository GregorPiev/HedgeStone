/**
 * Created by saar on 02/05/16.
 */

import './popup.less';
import '../../../../assets/js/scrollable';

export default angular.module('app.popups.popup', ['sun.scrollable'])
    .directive('popup', popupConfig);

function popupConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            popupOn: '=',
            cancel: '=',
            no: '=',
            yes: '=',
            headline: '=?',
            content: '=?',
            yesbtntitle: '=?',
            nobtntitle: '=?',
            settemplate: '=?',
            removecancel: '='

        },
        template: require('./popup.tpl.html'),
        controller: popupController,
        controllerAs: 'popup'
    }
}

class popupController {
    constructor($scope, popupsService, $state, userService) {
        this.$state = $state;
        this.popupsService = popupsService;
        this.$scope = $scope;
        this.popupOn = $scope.popupOn;
        this.cancel = $scope.cancel;
        this.no = $scope.no;
        this.yes = $scope.yes;

        let failed = require('./popup-failed.json');

        let terms = require('./popup-terms.json');
        
        let confirm = require('./popup-confirm.json');
        let confirmno = require('./popup-confirmno.json');

        let generic = require('./popup-generic.json');

        let success = require('./popup-success.json');
        //success.content.text = success.content.text.replace('Amount', popupsService.depositAmount);
        //success.content.text = success.content.text.replace('Currency', popupsService.depositCurrency);

        let bonus = require('./popup-bonus.json');

        let simple = require('./popup-simple.json');
        simple.img.src = simple.img.src.replace('<countrycode>', userService.userData.geoData.countryCode[0]);
        simple.content.text = simple.content.text.replace('<country>', userService.userData.geoData.countryName[0]);

        let tradeBlock = require('./popup-trade-block.json');
        let customPopupData = {
            primaryHeadline : {
                title: $scope.headline,
                class: `hl1`
            },
            content : {
                text: $scope.content
            },
            yesBtn: {
                title : $scope.yesbtntitle,
                class: 'btn'
            },
            cancelBtn : {
                title : $scope.nobtntitle,
                class: 'btn btn-transparent'
            },
            secondaryHeadline: {
                title: "important notice",
                class: "hl7"
            }
        };

        switch($scope.settemplate) {
            case 'failed':
                this.popupData = failed;
                break;
            case 'success':
                this.popupData = success;
                break;
            case 'terms':
                this.popupData = terms;
                break;
            case 'confirm':
                this.popupData = confirm;
                $(".closeImg").hide();
                break; 
             case 'confirmno':
                this.popupData = confirmno;
                $(".closeImg").hide();
                break; 
            case 'tradeBlock':
                this.popupData = tradeBlock;
                break;
            case 'custom':
                this.popupData = customPopupData;
                break;
            case 'simple':
                this.popupData = simple;
                break;
            case 'generic':
                this.popupData = generic;
                break;
            case 'bonus':
                bonus.content.text = $scope.content;
                bonus.terms.text = `<p>Bonus Policy Terms and Conditions<br /> <br />Before the Bonus can added to your account, you must review, understand and accept the Bonus Policy detailed below. If you do not understand and accept the Bonus Policy, you should NOT accept the Bonus. If you have any questions please consult with your Hedgestone representative or send an email to support@hedgestonegroup.com.<br /> <br />BONUS POLICY<br /> <br />All trading bonuses Offered by Icon Markets Limited (hereafter. the -Company.) are subject to<br />the provisions Of this Bonus Policy (the -Policy\"). This Policy an addendum to the<br />Company's main -Terms &amp; Conditions- which can be found at the Company's website<br />Before accepting a bonus from the Company. the Client must read, understand and accept the provisions Of this Policy by returning a signed copy to the Company<br /> <br />1. Eligibility<br />1.1. Any promotional offer is valid for only for the period stated in the promotional offer, unless<br />otherwise designated.<br />1.2. The Company Offers different bonus schemes and Other trading benefits to some Of its Clients from time-time.<br />1.3. The decision Of whether to grant a bonus to a certain Client is at the Company's sole and exclusive discretion.<br />1.4. The Client will be given opportunity to accept or decline any bonus or promotional offer presented to the Client by the Company.<br /><br /> <br />I, ${userService.userData.userSession.FirstName} ${userService.userData.userSession.LastName} , holder Of account number ${userService.userData.userSession.id}<br />have read, understood and accepted the terms and conditions of the Bonus Policy. Notwithstanding the additional terms and conditions<br />associated with the receiving the bonus, I wish to proceed.</p>`
                this.popupData = bonus;
                break;
        }

        //$scope.settemplate === 'custom' ? this.popupData = customPopupData : this.popupData = failed;

        $(document).keyup(function(e) {
            if (e.keyCode === 27) popupsService.popItDown();
            $scope.$apply();
        });
    }
}
