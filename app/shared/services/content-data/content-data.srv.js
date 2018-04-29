import _ from 'lodash';

export class ContentData {
    // this service is in charge of delivering different types of content to the app
    // such as articles, guides, videos and pages.


    /**
     * @constructor
     * construct function, define variables and run initial function.
     * @purpose - define variables and initial class.
     */
    constructor($http, $q, $state, originService,sitelanguageService,$rootScope) {
        'ngInject';
        this.$http = $http;
        this.pagesDir = _.includes(window.location.href, 'localhost') ? `app/components/page/jsons` : `pages`;
        this.data = {};
        this.$q = $q;
        this.$state = $state;        
        this.sitelanguageService = sitelanguageService;
        this.$rootScope = $rootScope;
        this.server = originService.apiUrl;
        this.apiUrl = '/api/fuel_object/page_by_device';
        this.device = 'mobile';
        this.params = '?device=' + this.device + '&name=';
        this.sampleRequest = this.server + this.apiUrl + this.params;
        //this.init();
    }

    /**
     * @init(async)
     * Initial function on startup the service.
     * @deprecated - no variables to initialize
     */
    init() {
        this.commonData();
    }

    /**
     * @commonData(async)
     * resolve the homepage
     * @deprecated - as a result of init()
     */
    commonData() {
        //return this.data;
        this.requestPage('home').then((res)=> {
            
            return res;
        });
    }

    /**
     * @requestPage(async)
     * used to generate the http request to get a json of a page.
     * @param pageName
     * @returns {*}
     */
    requestPage(pageName) {
        let request = this.sampleRequest + pageName;
        return this.requestData(request);
    }

    /**
     * @requestData(async)
     * doing the ajax call to get the page.
     * @param request
     * @returns {Promise|*}
     */
    requestData(request) {
        return this.$http.get(request, {cache: true, async: true})
            .then((response)=> {
                return response.data;
            });
    }

    /**
     * @requestArticles(async)
     * doing the ajax request to the articles url and stores the data in a variable
     * in order to prevent unnecessary duplicated requests.
     * @param articlesUrl
     * @returns {Promise|*}
     */
    requestArticles(articlesUrl) {
        return this.$http.get(articlesUrl, {async: true}).then((response) => {
            this.articles = response.data; // assigning the data to the variable that stores the articles object
            return response.data;
        });
    }

    /**
     * @getArticles(async)
     * this function is used by the outer functions that use this service.
     * @returns {promise|*|o.promise|i}
     */
    getArticles() {        
        let pagesUrlExt = (this.$rootScope.language==='')?'':('/' + this.$rootScope.language);
        let deferred = this.$q.defer();
        if (typeof this.articles === 'undefined') { // if there was no prior request for articles - do it
            this.requestArticles(`${this.pagesDir + pagesUrlExt}/article-list.json`).then(() => {
                deferred.resolve(this.articles);
            })
        } else { // the articles already requested in the past so no need to perform another request - just return the variable that holds the object
            deferred.resolve(this.articles);
        }
        return deferred.promise;
    }

    /**
     * @requestVideos(async)
     * doing the ajax request to the videos url and stores the data in a variable
     * in order to prevent unnecessary duplicated requests
     * @param videosUrl
     * @returns {Promise.<TResult>|*}
     */
    requestVideos(videosUrl) {
        return this.$http.get(videosUrl, {async: true}).then((response) => {
            this.videos = response.data; // assigning the data to the variable that stores the videos object
            return response.data;
        });
    }

    /**
     * @getVideos(async)
     * this function is used by the outer functions that use this service.
     * @returns {promise|*|o.promise|i}
     */
    getVideos() {
        let pagesUrlExt = (this.$rootScope.language==='')?'':('/' + this.$rootScope.language);
        let deferred = this.$q.defer();
        if (typeof this.videos === 'undefined') { // if there was no prior request for videos - do it
            this.requestVideos(`${this.pagesDir + pagesUrlExt}/video-list.json`).then(() => {
                deferred.resolve(this.videos);
            })
        } else { // the videos already requested in the past so no need to perform another request - just return the variable that holds the object
            deferred.resolve(this.videos);
        }
        return deferred.promise;
    }

    /**
     * @requestVideos(async)
     * doing the ajax request to the videos url and stores the data in a variable
     * in order to prevent unnecessary duplicated requests
     * @param guidesUrl
     * @returns {Promise|*}
     */
    requestGuides(guidesUrl) {
        return this.$http.get(guidesUrl, {async: true}).then((response) => {
            this.guides = response.data; // the variable that stores the videos object
            return response.data;
        });
    }

    /**
     * @getGuides(async)
     * this function is used by the outer functions that use this service.
     * @returns {promise|*|o.promise|i}
     */
    getGuides() {
        let pagesUrlExt = (this.$rootScope.language==='')?'':('/' + this.$rootScope.language);
        let deferred = this.$q.defer();
        if (typeof this.guides === 'undefined') {
            this.requestGuides(`${this.pagesDir + pagesUrlExt}/guides-list.json`).then(() => {
                deferred.resolve(this.guides);
            })
        } else { // the videos already requested in the past so no need to perform another request - just return the variable that holds the object
            deferred.resolve(this.guides);
        }
        return deferred.promise;
    }

    /**
     * @getPage(async)
     * doing ajax call to get the json of the requested page
     * @param pagesUrl
     * @returns {Promise}
     */
    getPage(pagesUrl) {
        let pagesUrlExt=this.sitelanguageService.getLanguage();        
        return this.$http.get(`${pagesUrl+pagesUrlExt}${this.$state.next.name}.json`, {
            async: true, cache: true
        }).then((response) => {
            return response.data;
        });
    }
}
