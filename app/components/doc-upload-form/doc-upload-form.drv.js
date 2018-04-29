/**
 * Created by saar on 13/07/16.
 */

import './doc-upload-form.less';


export default angular.module('app.page.section.docUploadForm', [])
    .directive('docUploadForm', docUploadFormConfig);

function docUploadFormConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./doc-upload-form.tpl.html'),
        controller: docUploadFormController,
        controllerAs: 'docUploadForm'
    }
}

class docUploadFormController {
    constructor($scope, domFactory, Upload, userService, $rootScope, $q, requestHandlerService, loadingFrameService, popupsService) {
        this.docUploadFormData = $scope.data;
        this.$scope = $scope;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.userService = userService;
        this.Upload = Upload;
        this.popupsService = popupsService;
        this.requestHandlerService = requestHandlerService;
        this.loadingFrameService = loadingFrameService;
        this.requireFields = [];

        this.html = "";
        this.html = domFactory.generateArray(this.docUploadFormData, 'docUploadForm', 'docUploadFormData');

        this.submitting();
    }

    submitting() {
        let formId = this.docUploadFormData.array[0]['new-form'].id;
        this.$scope.$on(`${formId}Submitting`, (event, formData) => {
            if(!this.disabled)
                this.submit(formData);
        });
    }

    validateRequires(formData, data) {
        let sendMsgToGenericValidation = () => {
            angular.forEach(this.requireFields, (value) => {
                let params = {
                    message: `This field is missing`,
                    isOptionalValid: false
                }
                this.$rootScope.$broadcast(`${value}GenericValid`, params);
            });
            this.requireFields = [];
            this.$scope.$apply();
        };
        let isRequireFieldIsFilled = (formData, key) => {
            if(_.isArray(formData[key].dynamicAttrs['require-field'])) {
                angular.forEach(formData[key].dynamicAttrs['require-field'], (value) => {
                    if(formData[value].dynamicAttrs['ng-model'] === "" || formData[value].dynamicAttrs['ng-model'] === true) {
                        
                        this.requireFields.push(value);
                    }
                });
            } else if(formData[formData[key].dynamicAttrs['require-field']].dynamicAttrs['ng-model'] === "" || formData[formData[key].dynamicAttrs['require-field']].dynamicAttrs['ng-model'] === true) {
                
                this.requireFields.push(formData[key].dynamicAttrs['require-field']);
            }
        };

        let keys = Object.keys(data);
        angular.forEach(keys, (value) => {
            if(typeof formData[value].dynamicAttrs['require-field'] !== 'undefined') {
                isRequireFieldIsFilled(formData, value);
            }
        });

        if(this.requireFields.length > 0){
            sendMsgToGenericValidation();
            return false;
        }
        return true
    }

    splitToChunks(data, allData) { // Split all fields
        let chunkNames = [];
        let chunkFiles = [];
        let chunkNamesTemp = [];
        let chunkFilesTemp = [];
        let chunkItTemp = (allData, key) => { // Insert field to chunk
            chunkFilesTemp.push(allData[key].dynamicAttrs['ng-model']);
            chunkNamesTemp.push(key);
        };

        let chunkIt = () => { // insert temp chunk to array of all chunks
            chunkFiles.push(chunkFilesTemp);
            chunkNames.push(chunkNamesTemp);
            this.sentChunks += `${chunkNamesTemp}, `;
        };

        let findInChunks = (key) => { // Find field name in chunks.
            if(chunkNames.length === 0)
                return false;
            let searchResult = false;
            angular.forEach(chunkNames, (value) => {
                if(value.indexOf(key) >= 0)
                    searchResult = true;
            });
            return searchResult;
        }
        angular.forEach(data, (value, key) => {
            if(!findInChunks(key)) { // Check if this field already exist in chunk.
                chunkItTemp(allData, key); // Insert to chunk.
                if(!_.isUndefined(allData[key].dynamicAttrs['require-field'])) { // Check if there is any field requires.
                    if(!_.isArray(allData[key].dynamicAttrs['require-field'])) { // Check is there is more the one field requires.
                        chunkItTemp(allData, allData[key].dynamicAttrs['require-field']); // Insert to chunk.
                    } else {
                        angular.forEach(allData[key].dynamicAttrs['require-field'], (fieldValue) => { // Chunk every require field in the array
                            chunkItTemp(allData, fieldValue); // Insert to chunk.
                        });
                    }
                }
                chunkIt(); // insert chunk to array of chunks;
            }
            
            chunkNamesTemp = [];
            chunkFilesTemp = [];
        });
       
        return {chunkNames, chunkFiles};
    }

    encodeFiles(chunks) {
        let encodeChunks = [];
        let requests = [];
        angular.forEach(chunks.chunkFiles, (value, key) => {
            let deferred = this.$q.defer();
            requests.push(deferred.promise);
            let strings = [];
            angular.forEach(value, (innerValue, innerKey) => { // Split all the non file data before encode to base64.
                if(typeof innerValue !== 'object') {
                    strings[innerKey] = innerValue;
                    value[innerKey] = "";
                }
            });
            this.Upload.base64DataUrl(value).then((res) => {
                //angular.forEach(strings, (value, key) => { // Merge back to the chunk all the non file data.
                //    res[key] = value;
                //});
                _.merge(res, strings); // Merge back to the chunk all the non file data.

                let chunk = {};
                angular.forEach(res, (innerValue, innerKey) => { // Order the chunk as object instead of array
                    chunk[chunks.chunkNames[key][innerKey]] = innerValue;
                });
                encodeChunks.push(chunk);
                deferred.resolve();
            }).catch((res) => {
                deferred.reject(res);
            });
        });

        return this.$q.all(requests).then((res) => { // Return promise after all chunks are encoded.
            return encodeChunks;
        }).catch((res) => {
            return res;
        });

    }

    sendChunks(chunks) {
        let requests = [];
        angular.forEach(chunks, (chunk) => {
            let deferred = this.$q.defer();
            requests.push(deferred.promise);
            this.userService.sendDocumentation(chunk).then((res) => {
                
                deferred.resolve(res);
            }).catch((res) => {
                
                deferred.resolve(res); // Resolve also errors to catch all promises when the all resolved.
            });
        });

        return this.$q.all(requests); // Return the result of all promises
    }

    submit(formData) {
        // this.loadingFrameService.startLoading();
        let formEmpty = true;
        
        let data = {}, allData = {};
        angular.forEach(formData, (value, key) => {
            
            if(value.attrs.name !== 'captcha') {
                allData[value.attrs.name] = value;
                if (value.dynamicAttrs['ng-model'] !== "") {
                    formEmpty = false;
                    data[value.attrs.name] = value.dynamicAttrs['ng-model'];
                }
            }
        });

       
        if(formEmpty) {
            return false;
        }

        this.sentChunks = ''; // names of the chunks sent in this upload. 'splitToChunks' function populate it.

        if(this.validateRequires(allData, data)) { // Validate that all require files are filled
            this.loadingFrameService.startLoading();
            let chunks = this.splitToChunks(data, allData);
            this.encodeFiles(chunks).then((res) => {
                this.disabled = true;
                this.sendChunks(res).then((res) => {
                    this.disabled = false;
                    let requests = [];
                    angular.forEach(res, (val, idx) => {
                        let deferred = this.$q.defer();
                        requests.push(deferred.promise);
                        this.requestHandlerService.handleResponding(val).then((res) => {
                            deferred.resolve(res);
                        }).catch((res) => {
                            deferred.reject(res);
                            this.loadingFrameService.stopLoading();
                        });
                    });
                    this.$q.all(requests).then((res) => {
                        let param = {
                            files: this.sentChunks.trim().slice(0, this.sentChunks.length-2)
                        };
                        this.userService.verifyAllDocumentUploadSuccessfuly(param).then((res) => {
                            
                            this.loadingFrameService.stopLoading();
                            this.popupsService.popItUp({
                                type: 'popup',
                                settemplate: 'custom',
                                headline: 'Success',
                                content: 'Your files have been uploaded successfully. The Verification team will review them and reply within the next 2 business days. <br><br>If you have any questions in regards to the above, please contact our Customer support team.'
                            });
                        });
                    });
                });
            });
        }
    }
}
