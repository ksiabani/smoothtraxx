'use strict';

angular.module('library').directive('trackCard', [
	function() {
		return {
            templateUrl: '../modules/library/views/templates/track-card.client.view.html'
		};
	}
]);

//angular.module('library').directive('trackCard', [
//	function() {
//		return {
//			template: '<div></div>',
//			restrict: 'E',
//			link: function postLink(scope, element, attrs) {
//				// Track card directive logic
//				// ...
//
//				element.text('this is the trackCard directive');
//			}
//		};
//	}
//]);
