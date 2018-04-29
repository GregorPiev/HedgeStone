/*
 Created by bnaya on 28/01/16,
 @Component Name: page.drv
 @Description:
 @Params:
 @Return:
 @Methods:
*/
import headline from '../headline/headline.drv';
import content from '../content/content.drv';
import contentBody from '../content-body/content-body.drv';
import filteredContentBody from '../filtered-content-body/filtered-content-body.drv';
import btn from '../btn/btn.drv';
import card from '../card/card.drv';
import unorderedList from '../unordered-list/unordered-list.drv';
import listItem from '../unordered-list/list-item/list-item.drv';
import ngTable from '../ng-table/ng-table.drv';
import tableRow from '../ng-table/table-row/table-row.drv';
import tableCell from '../ng-table/table-cell/table-cell.drv';
import ngImage from '../ng-image/ng-image.drv';
import asset from '../asset/asset.drv';
import loginForm from '../login-form/login-form.drv';
import depositForm from '../deposit-form/deposit-form.drv';
import depositThreeDForm from '../deposit-ThreeD-form/deposit-ThreeD-form.drv';
import accountForm from '../account-form/account-form.drv';
import accountBalance from '../account-balance/account-balance.drv';
import assetWidget from '../asset-widget/asset-widget.drv';
import accountOverview from '../account-overview/account-overview.drv';
import howToTrade from '../how-to-trade/how-to-trade.drv';
import tabSet from '../tab-set/tab-set.drv';
import createAccountForm from '../create-account-form/create-account-form.drv';
import forgotForm from '../forgot-form/forgot-form.drv';
import resetForm from '../reset-form/reset-form.drv';
import verifyForm from '../verify-form/verify-form.drv';
import results from '../results/results.drv.js';
import search from '../search/search.drv.js';
import searchableItem from '../results/searchable-item/searchable-item.drv'
import articleList from '../article-list/article-list.drv';
import article from '../article/article.drv';
import thumbnail from '../thumbnail/thumbnail.drv';
import navigate from '../navigate-btns/navigate-btns.drv';
import video from '../video/video.drv';
import guide from  '../guide/guide.drv';
import ecopayzForm from '../ecopayz-form/ecopayz-form.drv';
import headlineFitText from '../headline/headline-fittext/headline-fittext.drv';
import ticker from '../ticker/ticker.drv';
import withdrawalForm from '../withdrawal-form/withdrawal-form.drv';
import share from '../share/share.drv';
import depositAndWithdrawalTable from '../deposit-n-withdrawal-table/deposit-n-withdrawal-table.drv';
import ladderTable from '../ladder-table/ladder-table.drv';
import tradingActivityTable from '../trading-activity-table/trading-activity-table.drv';
import openPositionsTable from '../open-positions-table/open-positions-table.drv';
import oneTouchTable from '../one-touch-table/one-touch-table.drv';
import docUploadForm from '../doc-upload-form/doc-upload-form.drv';
import winsWidget from '../wins-widget/wins-widget.drv';
import vipTrade from '../vip-trade/vip-trade.drv';
import bonusStatus from '../bonus-status/bonus-status.drv';
import economicCalendar from '../economic-calendar/economic-calendar.drv';
import netellerForm from '../neteller-form/neteller-form.drv';
import skrillForm from '../skrill-form/skrill-form.drv';
import readMore from '../read-more/read-more.drv';
import './section.less';

export default angular.module('page.section', [headline.name, content.name, contentBody.name, filteredContentBody.name ,btn.name, card.name, unorderedList.name, listItem.name, ngTable.name, tableRow.name, tableCell.name, ngImage.name, asset.name, loginForm.name, accountBalance.name, assetWidget.name, howToTrade.name, tabSet.name, createAccountForm.name, results.name, search.name, searchableItem.name, forgotForm.name, resetForm.name, accountForm.name, accountOverview.name, verifyForm.name, depositForm.name, depositThreeDForm.name, articleList.name, article.name, thumbnail.name, navigate.name, video.name, guide.name, ecopayzForm.name, headlineFitText.name, withdrawalForm.name, depositAndWithdrawalTable.name, ladderTable.name, docUploadForm.name, tradingActivityTable.name, oneTouchTable.name, winsWidget.name, vipTrade.name, share.name, ticker.name, bonusStatus.name, openPositionsTable.name, netellerForm.name, skrillForm.name, economicCalendar.name, readMore.name])
    .directive('section', sectionConfig);

function sectionConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./section.tpl.html'),
        controller: sectionController,
        controllerAs: 'section'
    }
}


class sectionController {
    constructor($scope, domFactory) {
        this.sectionData = $scope.data;
        this.html = '';
         if(typeof this.sectionData.background !== 'undefined') {
             this.sectionData.backgroundStyle = {"background-image": 'url('+this.sectionData.background+')', "background-size": "cover", "background-repeat": "no-repeat", "background-position": "center"};
         }
        this.html = domFactory.generateArray(this.sectionData, 'section', 'sectionData');
    }

    withContainer() {
        if(!this.sectionData.container && typeof this.sectionData.container !== 'undefined')
            return this.html;
    }
}
