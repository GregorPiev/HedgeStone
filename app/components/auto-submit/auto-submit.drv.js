/*
 Created by bnaya on 28/01/16,
 @Component Name: page.drv
 @Description:
 @Params:
 @Return:
 @Methods:
 */
//import ngField from 'ng-field/ng-field.drv';

import './auto-submit.less';
export default angular.module('app.page.autoSubmit', [])
        .directive('autoSubmit', autoSubmitConfig);
function autoSubmitConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./auto-submit.tpl.html'),
        controller: autoSubmitController,
        controllerAs: 'autoSubmit'
    }
}

class autoSubmitController {
    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor($scope, $timeout, $rootScope, originService) {
        this.show = false;
        this.originService = originService;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.init();
        this.statusSampling = true;
        $scope.$on('autoSubmit.close', () => {
            this.close();
        });
        //this.$scope.data.watching=true;
        let _this = this;
        let depDataStatus = {
            'status': false,
            'message': '',
            'deposit_amount': 0,
            'bonus_amount': 0
        };
    }

    /**
     * @init
     * Initial listener on startup the service.
     * @result - Auto submit listener is on, submit the response form from 3d deposit service.
     */
    init() {
        let self = this;
        this.$scope.$on('autoSubmit', function (event, data) {

            self.show = true; // Define the auto-submit is on.
            self.frame = `<iframe id="autoSubmitFrame" frameborder="0"></iframe>`; // Define the iframe element.
            self.$timeout(() => {
                self.doc = $('#autoSubmitFrame')[0].contentWindow.document; // Define the Dom inside the iframe.
                self.body = $('body', self.doc); // Define the 'body' element inside the iframe.
                self.body.html(data); // Add the response form 3d deposit to the 'body' element.
            }, 0);
            self.$timeout(() => {
                self.body.find('form')[0].submit(); // Submit the form.
            }, 0);
        });
        this.$scope.$on('autoSubmitForm', function (event, data) {
            self.show = true; // Define the auto-submit is on.
            let url = self.originService.apiUrl + '/depositSpot.php';
            //let url = 'depositSpot.php';            
            document.domain = 'hedgestonegroup.com';
            let _this = self.frame;
            self.frame = `<iframe id="autoSubmitFrame" name="targRes" src="${url}?start=Game_start" frameborder="0" ></iframe>`; // Define the iframe element.
            
            self.$timeout(() => {
                $("#autoSubmitFrame").attr('src', url);
                let htmlForm = "<form id='myform' action='" + url + "' method='post' target='targRes'>";
                htmlForm += "<input type='hidden' name='pdata' value='" + data.replace(/'/g, '"') + "' />";
                htmlForm += "</form>";
                $(htmlForm).insertAfter($("#autoSubmitFrame"));
               
                let myform = $("#myform");
                $(myform).submit();                
            }, 6000);
        });
        this.$scope.$on('autoSubmitURL', function (event, urlRed, token, client_token, pttl) {

            self.show = true; // Define the auto-submit is on.
            self.statusSampling = true;
            self.frame = `<iframe id="autoSubmitFrame" src="${urlRed}" frameborder="0"></iframe>`; // Define the iframe element.
            self.$timeout(() => {
                self.doc = $('#autoSubmitFrame')[0].contentWindow.document; // Define the Dom inside the iframe.
            }, 0);
            let urlTest = self.originService.apiUrl + `/api/layer/deposit_get_status?token=${token}&client_token=${client_token}`;
            
            let counter = 1;
            let timeRefresh = 5000;
            let ttl = new Number(pttl);
            let maxCounter = parseInt((ttl / timeRefresh));
            


            function poll() {
                $.ajax({
                    url: urlTest,
                    type: 'GET'
                })
                        .done(function (data, textStatus, jqXHR) {

                            if (textStatus == 'false') {
                                self.changeSendButton();                                
                                self.depDataStatus = {
                                    'status': false,
                                    'message': data.error.real_text,
                                    'deposit_amount': 0,
                                    'bonus_amount': 0
                                };
                                self.statusDepositChange();
                            } else if (typeof data.deposit_success !== 'undefined' && data.deposit_success === true) {
                                self.changeSendButton();                               
                                self.depDataStatus = {
                                    'status': true,
                                    'message': '',
                                    'deposit_amount': data.deposit_amount,
                                    'bonus_amount': (typeof data.bonus_amount == 'undefined') ? 0 : data.bonus_amount
                                };                                
                                self.statusDepositChange();
                            } else if (typeof data.deposit_success !== 'undefined' && data.deposit_success === false) {
                                self.changeSendButton();
                                self.depDataStatus = {
                                    'status': false,
                                    'message': data.error.real_text,
                                    'deposit_amount': 0,
                                    'bonus_amount': 0
                                };
                                self.statusDepositChange();

                            } else if (counter > maxCounter) {
                                self.changeSendButton();
                               
                                $.get(self.originService.apiUrl + `/api/layer/deposit_ttl_finish?token=${token}&client_token=${client_token}`, function (data, status) {
                                    
                                });

                                self.depDataStatus = {
                                    'status': false,
                                    'message': 'Expired time',
                                    'deposit_amount': 0,
                                    'bonus_amount': 0
                                };
                                self.statusDepositChange();
                            } else if (typeof data.status !== 'undefined' && data.status == 'pending' && self.statusSampling == true) {
                                if ($("#spinnerDepositSmall").length == 0)
                                    $('<img id="spinnerDepositSmall" src="./assets/icons/preloader.gif" style="margin-top:25px;" alt="loading..." >').insertAfter(angular.element('#deposit-three-d-form button.submitBtn'));
                                angular.element('#deposit-three-d-form').attr('title', 'Waiting till result');
                                angular.element('#deposit-three-d-form button.submitBtn').hide();                                
                                self.$timeout(poll, timeRefresh);
                            } else if (self.statusSampling == true) {                                
                                self.$timeout(poll, timeRefresh);
                            }                            
                            counter++;
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {                            
                            self.changeSendButton();
                            $.get(self.originService.apiUrl + `/api/layer/deposit_ttl_deposit_ttl_finish?token=${token}&client_token=${client_token}`, function (data, status) {
                                
                            });
                            self.depDataStatus = {
                                'status': false,
                                'message': 'Server Error',
                                'deposit_amount': 0,
                                'bonus_amount': 0
                            };
                            self.statusDepositChange();
                        })
            }
            ;
            self.$timeout(poll, timeRefresh);
        });
        this.$scope.$on('autoSubmit.redirect', function (event, data) {

            self.show = true; // Define the auto-submit is on.
            self.frame = `<iframe id="autoSubmitFrame" src="${data}" frameborder="0"></iframe>`; // Define the iframe element.
            self.$timeout(() => {
                self.doc = $('#autoSubmitFrame')[0].contentWindow.document; // Define the Dom inside the iframe.
            }, 0);
        });
        $("#autoSubmitFrame").on('load', function () {
            
        });
    }

    /**
     * @close
     * Close the auto submit window.
     * @result - Closing the window and reset the iframe.
     */
    close() {
        //this.$rootScope.$broadcast('closeIframe');
        this.changeSendButton();
        this.show = false; // Define the auto-submit is off.
        this.doc.close(); // Close the window.
        this.frame = `<iframe id="autoSubmitFrame" frameborder="1"></iframe>`; // Reset the iframe element
    }

    remove() {
        //this.$rootScope.$broadcast('userClosedIframe');
        this.show = false; // Define the auto-submit is off.
        this.doc.close(); // Close the window.
        this.frame = `<iframe id="autoSubmitFrame" frameborder="1"></iframe>`;
    }

    statusDepositChange() {        
        this.$rootScope.$broadcast('exeDeposit', this.depDataStatus);
        //this.close();
    }

    changeSendButton() {
        this.statusSampling = false;
        if ($("#spinnerDepositSmall").length > 0)
            $("#spinnerDepositSmall").remove();
        angular.element('#deposit-three-d-form button.submitBtn').show();
        angular.element('#deposit-three-d-form').attr('title', '');
    }
}
