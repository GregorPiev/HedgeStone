/**
 * Created by saar on 18/04/16.
 * @Description: Allow ng-bind-html to display any text that goes through this filter
 */

export default angular.module('app.filters.sce', [])
    .filter('unsafe', ($sce)=> { return $sce.trustAsHtml; });