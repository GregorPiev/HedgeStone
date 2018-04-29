/**
 * Created by saar on 09/05/16.
 */
import './navigate-btns.less';

export default angular.module('app.section.navigate', [])
    .directive('navigateBtns', navigateBtnsConfig);


function navigateBtnsConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=',
            disableprev: '=',
            disablenext: '='
        },
        template: require('./navigate-btns.tpl.html'),
        controller: navigateBtnsController,
        controllerAs: 'navigateBtns'
    }
}


class navigateBtnsController {
    constructor($scope, $state, $stateParams, $window, contentDataService) {
        this.$scope = $scope;
        this.$state = $state;
        this.$window = $window;
        this.$stateParams = $stateParams;
        this.disableprev = $scope.disableprev;
        this.disablenext = $scope.disablenext;
        this.contentDataService = contentDataService;
    }

    next() {
        
        this.contentDataService.getArticles().then(() => {
            // search only in the array that matches the requested article's category.
            let articlesByCategory = _.find(this.contentDataService.articles, {'category': this.$stateParams.category});
            // articlesByCategory = this.sort(articlesByCategory);
            // create array of articles by their ids.
            let ids = _.findKeyInObj(articlesByCategory, 'name');
            ids = this.sort(ids)
            
            // find the specific requested article by its name, that was passed in $stateParams
            let article = _.find(ids, {'name': this.$stateParams.name});
            // find the index of this article in the array to navigate between articles.
            let idx = _.indexOf(ids, article);

            

            if (article) { // the article was found.
                idx=(idx==0)?idx:(idx - 1);
                
                //idx = idx - 1;
                article.forThumbnail = false; // cancel thumbnail, article will appear as full page
                
                let state = ids[idx].url ? 'video' : 'article';
                this.$state.go(state, {
                    id: ids[idx].id,
                    name: ids[idx].name,
                    category: ids[idx].category,
                    action: null
                });


            }
        });
    }

    prev() {
        
        this.contentDataService.getArticles().then(() => {
            // search only in the array that matches the requested article's category.
            let articlesByCategory = _.find(this.contentDataService.articles, {'category': this.$stateParams.category});
            // articlesByCategory = this.sort(articlesByCategory);
            // create array of articles by their ids.
            let ids = _.findKeyInObj(articlesByCategory, 'name');
            ids = this.sort(ids)
            
            // find the specific requested article by its name, that was passed in $stateParams
            let article = _.find(ids, {'name': this.$stateParams.name});
            // find the index of this article in the array to navigate between articles.
            let idx = _.indexOf(ids, article);

            

            if (article) { // the article was found.
                idx = idx + 1;
                
                article.forThumbnail = false; // cancel thumbnail, article will appear as full page
                
                let state = ids[idx].url ? 'video' : 'article';
                this.$state.go(state, {
                    id: ids[idx].id,
                    name: ids[idx].name,
                    category: ids[idx].category,
                    action: null
                });


            }
        });

        // this.$state.go(this.$state.current, {id: this.$stateParams.id, action: 'next'});
    }

    sort(data) {
        data = _.sortBy(data, (o) => {
            // let item = Object.keys(o)[0];
            return new Date(o.date);
        });
        data.reverse();
        return data;
    }
}
