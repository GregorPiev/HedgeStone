/**
 * Created by saar on 10/05/16.
 */


import './video.less'
import ytPlayer from 'angular-youtube-embed';

export default angular.module('app.section.video', [ytPlayer])
    .directive('video', videoConfig);

function videoConfig() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '='
        },
        template: require('./video.tpl.html'),
        controller: videoController,
        controllerAs: 'video'
    }
}

class videoController {
    constructor($scope, domFactory, $stateParams, contentDataService, $state) {
        this.videoData = $scope.data;
        // this.videoData.date = new Date(this.videoData.date);
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.contentDataService = contentDataService;
        this.domFactory = domFactory;
        this.html = '';

        if ($stateParams.id || $stateParams.name) // by this we understand that we want to render a specific video and not the all list.
            this.getVideo();
        else this.html = this.domFactory.generateArray(this.videoData, 'video', 'videoData');
    }

    getVideo() {
        this.contentDataService.getVideos().then(() => {
            let videosByCategory = _.find(this.contentDataService.videos, {'category': this.$stateParams.category});
            let ids = _.findKeyInObj(videosByCategory, 'id');
            let video = _.find(ids, {'name': this.$stateParams.name});
            let idx = _.indexOf(ids, video);
            this.disableNext = idx === ids.length - 1;
            this.disablePrev = idx === 0;
            this.videoData = '';
            if (video) {
                video.forThumbnail = false;
                if (this.$stateParams.action) {
                    switch (this.$stateParams.action) {
                        case 'next':
                            idx = idx + 1;
                            this.$state.go('video', {
                                id: ids[idx].id,
                                name: ids[idx].name,
                                action: null
                            });
                            break;

                        case 'prev':
                            idx = _.indexOf(ids, video);
                            idx = idx - 1;
                            this.$state.go('video', {
                                id: ids[idx].id,
                                name: ids[idx].name,
                                action: null
                            });
                            break;
                        default:
                            this.videoData = video;
                            break;
                    }
                }
                else
                    this.videoData = video;
                if (typeof this.videoData.background !== 'undefined') {
                    this.videoData.backgroundStyle = {
                        "background-image": 'url(' + this.videoData.background + ')',
                        "background-position": "center"
                    };
                }
                this.html = this.domFactory.generateArray(this.videoData, 'video', 'videoData') + '<navigate-btns disableprev="video.disablePrev" disablenext="video.disableNext"></navigate-btns>';
            } else {
                // TODO: replace this with 404 page
                this.$state.go('home');                
            }
        });
    }

    showFullVideo() {
        this.$state.go('video', {id: this.videoData.id, category: this.videoData.category, name: this.videoData.name});
    }
}
