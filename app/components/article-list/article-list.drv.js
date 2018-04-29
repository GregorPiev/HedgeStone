/**
 * Created by saar on 04/05/16.
 * @Component: article-list.drv
 * @Description: This directive is in-charge of organizing the list of the content.
 */

import './article-list.less';

export default angular.module('app.page.articles', [])
    .directive('articleList', articleConfig);

function articleConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./article-list.tpl.html'),
        controller: articleListController,
        controllerAs: 'articleList'
    }
}

class articleListController {
    constructor($rootScope, $scope, domFactory, contentDataService, $state, loadingFrameService, $timeout, $filter) {
        // this.html = ""; 
        $rootScope.counter =0;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        
        this.articleData = $scope.data;
        this.$state = $state;
        this.$filter = $filter;
        this.contentDataService = contentDataService;
        this.loadingFrameService = loadingFrameService;
        this.loadingFrameService.startLoading();
        this.domFactory = domFactory;
        this.init();

    }

    init() {
        this.articles = [];

        this.maxSize = 8;
        this.$scope.$on('readMore', (e, size) => {
            this.maxSize += size;
            this.showReadMore();
        });

        this.renderArticles();

    }

    renderArticles() {
        // find the tabs object inside the json tree.

        switch (this.articleData.type) {
            case 'articles': {

                this.contentDataService.getArticles().then((articles) => { // get content with the content service
                    if (this.articleData.category === 'all') {
                        articles.forEach((a) => this.articles = this.articles.concat(a.array))
                    } else {
                        this.articles = _.find(articles, {category: this.articleData.category}).array;
                    }
                    this.articles.forEach((value) => {
                        if (value.article)
                            value.article.forThumbnail = true;
                        if (value.video)
                            value.video.forThumbnail = true;
                    });
                    this.articles = this.sort(this.articles);
                    this.loadingFrameService.stopLoading();
                });
                break;
            }

            case 'guides': {
                this.tabs = _.findKeyInObj(this.articleData, 'category');
                // find the tab that suppose to include all the articles.
                this.allTab = _.find(this.tabs, {'category': 'All'});
                this.blogTab = _.find(this.tabs, {'category': 'blog'});
                this.marketTab = _.find(this.tabs, {'category': 'market'});

                angular.forEach(this.tabs, (tabsVal, tabsIndex) => { // clear previous data if existed.
                    this.tabs[tabsIndex].array = [];
                });

                this.allTab.array = [];
                this.contentDataService.getGuides().then(() => {
                    this.arrangeInTabs(this.contentDataService.guides, 'guide');
                    this.html = this.domFactory.generateArray(this.articleData, 'articleList', 'articleData');
                    this.loadingFrameService.stopLoading();
                });
                break;
            }
        }

    }

    /**
     * @Description: Divide the data to the tabs according to its type.
     * @param data
     * @param type
     */
    arrangeInTabs(data, type) {
        angular.forEach(data, (responseVal, responseIndex) => {
            angular.forEach(data[responseIndex].array, (val, index) => {
                // add all data to the 'All' tab and make them thumbnails
                data[responseIndex].array[index][`${type}`].forThumbnail = true;
                this.allTab.array.push(data[responseIndex].array[index]);
            });
        });
        angular.forEach(this.tabs, (tabsVal, tabsIndex) => {
            // match the data to its tab. the category of the data and the tab must match.
            let tab = _.find(data, {'category': this.tabs[tabsIndex].category});
            tab ? this.tabs[tabsIndex].array = this.tabs[tabsIndex].array.concat(tab.array) : "";
        });
    }

    sort(data) {
        data = _.sortBy(data, (o) => {
            let item = Object.keys(o)[0];
            return new Date(o[item].date);
        });
        data.reverse();
        return data;
    }

    showReadMore() {
        this.$rootScope.counter++;        
        if(this.$rootScope.counter==1){
            if(this.maxSize >= this.articles.length){            
                this.$rootScope.$broadcast('hideReadMore', false);
            }
        } 
        this.$rootScope.counter=(this.$rootScope.counter==3)?0:this.$rootScope.counter;
        //return this.maxSize >= this.articles.length;
    }
}
