'use strict';

// Tracks controller
angular.module('tracks').controller('TracksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tracks', '$sce', '$timeout',
    function ($scope, $stateParams, $location, Authentication, Tracks, $sce, $timeout) {

        $scope.authentication = Authentication;
        $scope.queryLimit = 10;
        $scope.tracksGenre = '';
        $scope.tracksCategory = '';


        // Videogular
        $scope.state = null;
        $scope.API = null;
        $scope.currentVideo = 0;

        $scope.onPlayerReady = function (API) {
            $scope.API = API;
        };

        $scope.onCompleteVideo = function () {
            $scope.isCompleted = true;
            $scope.currentVideo++;
            if ($scope.currentVideo >= $scope.videos.length)
                $scope.currentVideo = 0;
            $scope.setVideo($scope.currentVideo);
        };

        $scope.videos = [
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl('https://s3-eu-west-1.amazonaws.com/smx2015/RaiNAS_1/RaiNAS/music/live/2015/011e98c858d622c23c50141c4ad644ae.mp3'),
                        type: 'audio/mpeg'
                    }
                ]
            },
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl('https://s3-eu-west-1.amazonaws.com/smx2015/RaiNAS_1/RaiNAS/music/live/2015/019c2ba9136e6091626b611b3608347b.mp3'),
                        type: 'audio/mpeg'
                    }
                ]
            }

        ];

        $scope.config = {
            preload: 'none',
            autoPlay: true,
            sources: $scope.videos[0].sources
        };

        $scope.setVideo = function (index) {
            $scope.API.stop();
            $scope.currentVideo = index;
            $scope.config.sources = $scope.videos[index].sources;
            $timeout($scope.API.play.bind($scope.API), 100);
        };


        // Dropdown
        // http://stackoverflow.com/questions/28050980/how-can-i-modify-an-angularjs-bootstrap-dropdown-select-so-that-it-does-not-us
        $scope.ddItems = [
            {id: 0, name: 'Soulful House'},
            {id: 1, name: 'Deep House'},
            {id: 2, name: 'Afro House'},
            {id: 3, name: 'all genres'}
        ];

        $scope.ddItem = null;

        $scope.ddCallback = function (item) {
            $scope.tracksGenre = item.name === 'all genres' ? '' : item.name;
            $scope.find();
        };


        // Tabs
        $scope.tabs = [
            {title: 'Trending', icon: 'line-chart', category: ''},
            {title: 'Just Added', icon: 'calendar-o', category: ''},
            {title: 'Queue', icon: 'clock-o', category: 'queue'},
            {title: 'Unheard', icon: 'headphones', category: ''}
        ];

        $scope.tabCallback = function (tabCategory) {
            $scope.tracksCategory = tabCategory;
            $scope.find();
        };


        // Create new Track
        $scope.create = function () {
            // Create new Track object
            var track = new Tracks({
                name: this.name
            });

            // Redirect after save
            track.$save(function (response) {
                $location.path('tracks/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Track
        $scope.remove = function (track) {
            if (track) {
                track.$remove();

                for (var i in $scope.tracks) {
                    if ($scope.tracks [i] === track) {
                        $scope.tracks.splice(i, 1);
                    }
                }
            } else {
                $scope.track.$remove(function () {
                    $location.path('tracks');
                });
            }
        };

        // Update existing Track
        $scope.update = function () {
            var track = $scope.track;

            track.$update(function () {
                $location.path('tracks/' + track._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Tracks
        $scope.find = function () {
            $scope.queryPage = 1;
            $scope.tracks = Tracks.query({
                    page: $scope.queryPage,
                    limit: $scope.queryLimit,
                    category: $scope.tracksCategory,
                    genre: $scope.tracksGenre
                });
        };


        // Used with infinite scrolling
        // http://stackoverflow.com/questions/20047354/angularjs-push-array-of-data-retrieved-from-a-resource-service-in-another-array
        $scope.findMore = function () {
            $scope.busy = true;
            $scope.queryPage += 1;
            Tracks.query({
                    page: $scope.queryPage,
                    limit: $scope.queryLimit,
                    category: $scope.tracksCategory,
                    genre: $scope.tracksGenre
                },
                function (data) {
                    $scope.tracks.push.apply($scope.tracks, data);
                    $scope.busy = false;
                });
        };

        // Find existing Track
        $scope.findOne = function () {
            $scope.track = Tracks.get({
                trackId: $stateParams.trackId
            });
        };
    }
]);
