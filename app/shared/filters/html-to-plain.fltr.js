/**
 * Created by saar on 18/04/16.
 * @Description: Removes HTML tags from a string
 */

export default angular.module('app.filters', [])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }
);