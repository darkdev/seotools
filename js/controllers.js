function SuggestController($scope, $rootScope, GoogleSuggest) {
    $scope.keyword = ""
    $scope.suggests = []
    $scope.progress = 0
    $scope.showProgress = false
    $scope.nbResults = 0
    $scope.shouldBeOpen = false
    $scope.allKeywords = ""

    $scope.$on('keywordSuggested', function (event, data) {
        $scope.$apply(function () {
            $scope.nbResults++
            $scope.allKeywords += data.keyword + "\n"
            $scope.suggests.push(data)
        });
    });

    $scope.$on('progress', function (event, data) {
        $scope.$apply(function () {
            $scope.progress = (data.nbCurrentKeyword / data.nbKeywords * 100).toFixed(0)
        });
    });

    $scope.$on('endSuggest', function (event, data) {
        $scope.$apply(function () {
            $scope.endSuggest = true
            localStorage[$scope.keyword] = JSON.stringify($scope.suggests);
        });
    });

    $scope.open = function () {
        $scope.shouldBeOpen = true
    };

    $scope.showLastSearch = function () {
        if (localStorage["keywords"] == undefined) {
            $scope.lastSuggests = []
        } else {
            $scope.lastSuggests = JSON.parse(localStorage["keywords"])
        }
        $scope.lastSuggest = !$scope.lastSuggest;
    };

    $scope.close = function () {
        $scope.shouldBeOpen = false
    };

    $scope.scrap = function () {
        var keywords
        if (localStorage["keywords"] == undefined) {
            keywords = []
        } else {
            keywords = JSON.parse(localStorage["keywords"])
        }

        if (keywords.indexOf($scope.keyword) == -1) {
            keywords.unshift($scope.keyword)
        }

        localStorage["keywords"] = JSON.stringify(keywords);

        $scope.allKeywords = ""
        $scope.nbResults = 0
        $scope.endSuggest = false
        $scope.suggests = []
        $scope.showProgress = true
        GoogleSuggest.suggest($scope.keyword)
    }

    $scope.showSearchInCache = function (suggest) {
        $scope.lastSuggest = false
        $scope.keyword = suggest
        $scope.allKeywords = ""
        $scope.suggests = JSON.parse(localStorage[suggest])

        var length = $scope.suggests.length;
        for (var i = 0; i < length; i++) {
            $scope.allKeywords += $scope.suggests[i].keyword + "\n"
        }
        $scope.nbResults = length
        $scope.showProgress = true
        $scope.endSuggest = true
    }

    $scope.deleteCachedKeyword = function($index){
        localStorage.removeItem($scope.lastSuggests[$index])
        var keywords = JSON.parse(localStorage["keywords"])
        var index = keywords.indexOf($scope.lastSuggests[$index])
        $scope.lastSuggests.splice($index,1)
        keywords.splice(index,1)

        localStorage["keywords"] = JSON.stringify(keywords)
    }
}
