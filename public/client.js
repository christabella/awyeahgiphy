var song = document.getElementById('song');
var textTrack = song.textTracks[0]; // Get the first (and only) track element in audio element
var cuesTexts = [];
var textIdx = 0;
var gifIdx = 0;
var keywords = [];
// var canvas = document.getElementById('canvas');
// var context = canvas.getContext('2d'); 
$(window).on( "load", function (){
    // for (var j = 0; j < textTrack.cues.length; ++j) {
    for (var j = 0; j < 30; ++j) { // because microsoft throttles over 30...
        var cue = textTrack.cues[j];
        cuesTexts[j] = cue.text;
        /******** GET COGNITIVE STUFF *************/
        var body = {
          "documents": [
            {
              "language": "en",
              "id": j,
              "text": cuesTexts[j]
            }
          ]
        };          
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases",
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Access-Control-Allow-Origin","*");
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","2c7c79a10d60495092179510ea2b0381");
            },
            type: "POST",
            // Request body
            data: JSON.stringify(body)
        })
        .done(function(data) {
            console.log(data.documents[0].keyPhrases);
            keywords[parseInt(data.documents[0].id)] = data.documents[0].keyPhrases.join(" ");
            console.log(keywords[parseInt(data.documents[0].id)]);
            console.log(data.documents[0].keyPhrases.join(" "));
            if (keywords[parseInt(data.documents[0].id)] === "") {
                keywords[parseInt(data.documents[0].id)] = "cheers";
            }
        })
        .fail(function() {
            alert("error");
        });

        /******** DONE W COGNITIVE STUFF *************/



        cue.onenter = function(){
            console.log("execute cue onenter");
            var gifImgUrl;
            $.get( "/id/" + gifIdx, function( data ) {
                console.log(data);
                document.body.style.backgroundImage = "url('" + data; + "')";
            });

            $("#subtitles").text(cuesTexts[textIdx]);
            textIdx++;
            gifIdx++;


            

        };
        // do something
    }
});


// Trigger photo take
document.getElementById('snap').addEventListener('click', function() {
    //var fullQuality = canvas.toDataURL("image/jpeg", 1.0);
    var youtubeURL = $('#idtext').val();

    $("#intro").hide();

    $.post('/loadGifsAndSong', 
    {
        url : youtubeURL,
        cues : keywords
    }, 
    function(data, textStatus, jqxhr) {
        console.log('sent request to load gifs and song!')
        // Wait 5 seconds
        setTimeout(function (){

            // Something you want delayed.
            song.play();
            textTrack.mode = "showing";

        }, 5000);
    })
});



/******************************** main ****************************************/

