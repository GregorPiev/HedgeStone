/**
 * Created by saar on 05/05/16.
 * @Component: article.drv
 * @Description: Article logic. Determine if the article should be presented as a thumbnail or a full page. Navigate between articles.
 */
import './article.less';

export default angular.module('app.page.article', [])
    .directive('article', articleConfig);


function articleConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./article.tpl.html'),
        controller: articleController,
        controllerAs: 'article'
    }
}

class articleController {
    constructor($scope, domFactory, $stateParams, contentDataService, $state, $window) {
        this.articleData = $scope.data;
        // this.articleData.date = new Date(this.articleData.date);
        this.$state = $state;
        this.$window = $window;
        this.$stateParams = $stateParams;
        this.contentDataService = contentDataService;
        this.domFactory = domFactory;
        this.html = '';
        if ($stateParams.id || $stateParams.name) // by this we understand that we want to render a specific article and not the all list.
            this.getArticle();
        else this.html = this.domFactory.generateArray(this.articleData, 'article', 'articleData');
    }

    /**
     * @Description: Get a specific article by its ID, according to the parameters sent in the URL and render it
     *               to be a full page.
     * @Params: $stateParams
     */
    getArticle() {
                
        this.contentDataService.getArticles().then(() => {            
            
            // search only in the array that matches the requested article's category.
            //let articlesByCategory = _.find(this.contentDataService.articles, {'category': this.$stateParams.category});
            // create array of articles by their ids.
            //let ids = _.findKeyInObj(articlesByCategory, 'name');
            
            let ids = _.findKeyInObj(this.contentDataService.articles, 'name');
            // find the specific requested article by its name, that was passed in $stateParams
            let article = _.find(ids, {'name': this.$stateParams.name});
            // find the index of this article in the array to navigate between articles.
            let idx = _.indexOf(ids, article);            
            
            // In case the article is first/last in the array - don't allow previous/next buttons to avoid memory overflow.
            // They are used in the navigate-btns component.
            this.disableNext = idx === ids.length - 1;
            this.disablePrev = idx === 0;            
            this.articleData = ''; // initialize article data to avoid errors
            if (article) { // the article was found.
                article.forThumbnail = false; // cancel thumbnail, article will appear as full page
                // if (this.$stateParams.action) { // if $state params provided an action to go to the next/previous article.
                //     switch (this.$stateParams.action) {
                //         case 'next':
                //             idx = idx + 1;
                //             this.$state.go('article', {
                //                 id: ids[idx].id,
                //                 name: ids[idx].name,
                //                 action: null
                //             });
                //             break;
                //
                //         case 'prev':
                //             idx = idx - 1;
                //             this.$state.go('article', {
                //                 id: ids[idx].id,
                //                 name: ids[idx].name,
                //                 action: null
                //             });
                //             break;
                //         default:
                //             this.articleData = article;
                //             break;
                //
                //     }
                // }
                // else
                            this.articleData = article;
                if (typeof this.articleData.background !== 'undefined') {
                    this.articleData.backgroundStyle = {
                        "background-image": 'url(' + this.articleData.background + ')',
                        "background-position": "center"
                    };
                }
                this.html = this.domFactory.generateArray(this.articleData, 'article', 'articleData') + '<navigate-btns disableprev="article.disablePrev" disablenext="article.disableNext"></navigate-btns>';
            } else {
                // TODO: replace this with 404 page
                this.$state.go('home');                
            }
        });

    }

    /**
     * This method is launched by the thumbnail HTML template once a thumbnail is clicked.
     */
    showFullArticle() {
        this.$state.go('article', {id: this.articleData.id, category: this.articleData.category, name: this.articleData.name});
    }

}