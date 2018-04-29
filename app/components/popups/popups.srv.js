 /*
 Created by bnaya on 26/01/16,
 @Component Name: deposit.srv
 @Description:
 @Params:
 @Return:
 @Methods:
*/

 export class Popups {
     constructor($rootScope, $timeout) {
         'ngInject';
         this.popupOn = false;
         this.$rootScope = $rootScope;
         this.$timeout = $timeout;
         this.htmlArray = [];
         this.currentData = {};
         this.currentDataArray = [];
         this.defaultData = {
             cancel: function() {
                 this.popupsService.popItDown();
             },
             no: function() {
                 this.popupsService.popItDown();
             },
             yes: function() {
                 this.popupsService.popItDown();
             }
         };
     }

     popItUp(data, importance, timeout) {
         this.popupOn = true;
         this.currentData = data;
         let html = `<${data.type} popupOn="popups.popupOn"`;
         html += (typeof data.yes !== 'undefined') ? ` yes="popups.currentData.yes"` : ` yes="popups.defaultData.yes"`;
         html += (typeof data.no !== 'undefined') ? ` no="popups.currentData.no"` : ` no="popups.defaultData.no"`;
         html += (typeof data.cancel !== 'undefined') ? ` cancel="popups.currentData.cancel"` : ` cancel="popups.defaultData.cancel"`;
         html += (typeof data.content !== 'undefined') ? ` content="popups.currentData.content"` : ` content="popups.defaultData.content"`;
         html += (typeof data.headline !== 'undefined') ? ` headline="popups.currentData.headline"` : ` headline="popups.defaultData.headline"`;
         html += (typeof data.yesbtntitle !== 'undefined') ? ` yesbtntitle="popups.currentData.yesbtntitle"` : ` yesbtntitle="popups.defaultData.yesbtntitle"`;
         html += (typeof data.nobtntitle !== 'undefined') ? ` nobtntitle="popups.currentData.nobtntitle"` : ` nobtntitle="popups.defaultData.nobtntitle"`;
         html += (typeof data.settemplate !== 'undefined') ? ` settemplate="popups.currentData.settemplate"` : ` settemplate="popups.defaultData.settemplate"`;
         html += (typeof data.removecancel !== 'undefined') ? ` removecancel="popups.currentData.removecancel"` : ` removecancel="popups.defaultData.removecancel"`;
         html += `></${data.type}>`;
         if(_.isEmpty(this.htmlArray) && _.isEmpty(this.currentDataArray) || html !== this.htmlArray[this.htmlArray.length-1] || !_.deepCompare(this.currentData, this.currentDataArray[this.currentDataArray.length-1]) || data.settemplate === 'bonus') {
             switch(importance) {
                 case 'first': {
                     this.htmlArray.unshift(html);
                     this.currentDataArray.unshift(this.currentData);
                     this.$rootScope.$broadcast('popups');
                     break;
                 }

                 default: {
                     this.htmlArray.push(html);
                     this.currentDataArray.push(this.currentData);
                     this.$rootScope.$broadcast('popups');
                 }
             }
         }

         if(timeout)
             this.timer = this.$timeout(() => { this.popItDown(); }, timeout)
     }

     popItDown() {
         this.htmlArray.shift();
         this.currentDataArray.shift();
         if(this.htmlArray.length <= 0) {
             this.popupOn = false;
         }
         this.$rootScope.$broadcast('popupClosed');
         this.$timeout(() => this.$rootScope.$broadcast('popups'));
         if(this.timer)
             this.$timeout.cancel(this.$timer);
     }

     setDepositSuccessData(amount, currency) {
         this.depositAmount = amount;
         this.depositCurrency = currency;
     }
 }
