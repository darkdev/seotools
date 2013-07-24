angular.module('suggestService', []).
    factory('GoogleSuggest', ['$rootScope', '$http', function ($rootScope, $http) {
    var prefixSuffix = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3",
        "4", "5", "6", "7", "8", "9", ""]
    var sentences = ["comment * ", "où * ", "pourquoi * "]
    var keywords = []
    var nbKeywords, nbCurrentKeyword;

    var GoogleSuggest = {
        suggest:function (keyword) {
            composeKeyword(keyword)
            $rootScope.$broadcast('suggest', {})
        }
    }

    $rootScope.$on('suggest', function (event, data) {
        if (keywords.length == 0) {
            $rootScope.$broadcast('endSuggest', {})
        } else {
            nbCurrentKeyword++
            scrap(keywords.shift())
        }
    });

    function composeKeyword(keyword) {
        for (var i = 0; i < prefixSuffix.length; i++) {
            keywords.push(keyword + " " + prefixSuffix[i])
            keywords.push(prefixSuffix[i] + " \"" + keyword + "\"")
        }

        for (var i = 0; i < sentences.length; i++) {
            keywords.push(keyword + " " + sentences[i])
        }

        nbCurrentKeyword = 0;
        nbKeywords = keywords.length;

        return keywords;
    }

    function scrap(keyword) {
        $.when($.ajax({
            url:"http://www.google.com/complete/search",
            type:"GET",
            crossDomain:true,
            data:{
                q:keyword,
                output:"toolbar",
                oe:"utf8",
                hl:"fr"
            }
        })).then(function (data) {
                var results = $(data).find("CompleteSuggestion")

                for (i = 0; i < results.length; i++) {
                    var keyword = $("suggestion", results[i]).attr("data")
                    var nbSearch = 0;
                    if ($("num_queries", results[i]).attr("int")) {
                        nbSearch = $("num_queries", results[i]).attr("int")
                    }

                    $rootScope.$broadcast('keywordSuggested', {
                        "keyword":keyword,
                        "nbSearch":nbSearch
                    })
                }

                $rootScope.$broadcast('progress', {
                    "nbKeywords":nbKeywords,
                    "nbCurrentKeyword":nbCurrentKeyword
                })
                $rootScope.$broadcast('suggest', {})
            }).fail(function (xhr) {
                alert("Tu as trop abusé avec google, patiente un peu ou utilise des proxys :)");
            });
    }

    return GoogleSuggest;
}])