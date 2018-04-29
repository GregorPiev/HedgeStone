/**
 * Created by saar on 22/06/16.
 */

import './share.less';

export default angular.module('page.section.share', [])
    .directive('share', shareConfig);

function shareConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./share.tpl.html'),
        controller: shareController,
        controllerAs: 'share'
    }
}

class shareController {
    constructor($window) {
        this.$window = $window;
    }

    share(media) {
        // phase 1 : share is very simple. no options, no meta tags
        let href = this.$window.location.href;
        let url = '';
        let text = 'I find it interesting...%0A';
        switch (media) {
            case 'facebook': {
                url = `https://www.facebook.com/sharer/sharer.php?u=${href}`;
                break;
            }

            case 'twitter': {
                url = `https://twitter.com/home?status=${text}${href}`;
                break;
            }

            case 'gplus': {
                url = `https://plus.google.com/share?url=${href}`;
                break;
            }

            case 'pinterest': {
                url = `https://pinterest.com/pin/create/button/?url=${href}&media=&description=${text}`;
                break;
            }
        }

        this.$window.open(url, 'new', `width=${this.$window.innerWidth/4}, height=${this.$window.innerHeight/4}`);
    }
}

