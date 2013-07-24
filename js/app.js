angular.module('seoTools', ['suggestService','ui.bootstrap']).
    config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {templateUrl:'html/googleSuggest.html', controller:SuggestController}).
        otherwise({redirectTo:'/'});
}]);