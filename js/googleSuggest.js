var GoogleSuggest = {
    letters : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n",
    "o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3",
    "4","5","6","7","8","9"],
    keywords : new Array(),
    nbKeywords: 0,
    current: 0,
    results: null,
    init : function(){
        GoogleSuggest.nbKeywords = 0;
        GoogleSuggest.current = 0;
        GoogleSuggest.keywords = new Array();
        GoogleSuggest.results = new Array();
    },
    start : function(keyword,callback){
        GoogleSuggest.keywords.push(keyword)
        GoogleSuggest.keywords.push(keyword+" ")
        for (i = 0; i < GoogleSuggest.letters.length; i++) {
            GoogleSuggest.keywords.push(keyword+" "+GoogleSuggest.letters[i])
            GoogleSuggest.keywords.push(GoogleSuggest.letters[i]+" \""+keyword+"\"")
            GoogleSuggest.keywords.push("comment * "+keyword+" "+GoogleSuggest.letters[i])
            GoogleSuggest.keywords.push("où * "+keyword+" "+GoogleSuggest.letters[i])
            GoogleSuggest.keywords.push("pourquoi * "+keyword+" "+GoogleSuggest.letters[i])
        }

        GoogleSuggest.nbKeywords = GoogleSuggest.keywords.length;
        GoogleSuggest.scrap(callback)
    },
    scrap : function(callback){
        if(GoogleSuggest.keywords.length > 0){
            GoogleSuggest.current++;
            $.when($.ajax({
                url:"http://www.google.com/complete/search",
                type:"GET",
                crossDomain:true,
                data:{
                    q:GoogleSuggest.keywords.shift(),
                    output:"toolbar",
                    oe:"utf8",
                    hl:"fr"
                }
            }))
            .then(function(data){
                var results = $(data).find("CompleteSuggestion")

                for (i = 0; i < results.length; i++) {
                    var line = "<tr class='line'>"
                    +"<td>"+""+"</td>"
                    +"<td>"+$("suggestion",results[i]).attr("data")+"</td>";

                    if($("num_queries",results[i]).attr("int")){
                        line += "<td>"+$("num_queries",results[i]).attr("int")+"</td>"
                    }else{
                        line += "<td> 0 </td>"
                    }

                    line += "</tr>";

                    $("#keywords-text").append($("suggestion",results[i]).attr("data")+"\n");
                    $("#resultsTable").append(line);
                }

                $(".bar").css("width",(GoogleSuggest.current/GoogleSuggest.nbKeywords*100).toFixed(0)+"%")
                GoogleSuggest.scrap(callback)

            })
            .fail(function(xhr){
                alert("Tu as trop abusé avec google, patiente un peu ou utilise des proxys :)");
                callback($(".line").length);
            });
        }else{
            callback($(".line").length);
        }
    }
}
