var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var request = require('request');

var gifUrls = [];

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit : '5mb' }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));


// Require with custom API key
var giphy = require('giphy-api')('dc6zaTOxFJmzC');
// Require with the public beta key
var giphy = require('giphy-api')();




app.post('/loadGifsAndSong', function(req, res){

    var youtubeUrl = req.body.url;

    console.log(req.body);
    var cues = req.body['cues[]'];
    console.log("cues!\n");
    console.log(cues);
    for (var i = 0; i < 30; ++i) {
        giphy.search({
            q: cues[i],
            limit: 1
        }
        , function(err, res) {
            // Res contains gif data!
            console.log(res.data[0].images);
            console.log(res.data[0].images.original.url);
            var gifUrl = res.data[0].images.original.url;
            gifUrls.push(gifUrl);
            // require("fs").writeFile( './public/' + i + ".txt", gifUrl, "utf8", function(err) {
            //     if (err)
            //         return res.send({status : 'error', error : err})

            //     res.json({status : "success"});
            // });
        });
        
    }   
    res.json({status : "success"});
});

app.get('/id/:id', function (req, res) {
    var id = req.params.id;
    console.log("requesting id: " + parseInt(id) + 10);
    console.log(gifUrls);
    console.log(gifUrls[0]);
    if(typeof gifUrls[parseInt(id)] === 'undefined') {
        res.send("http://rs912.pbsrc.com/albums/ac325/shockcaptain117/banana_dance.gif~c200");
    } else {
        res.send(gifUrls[parseInt(id)]);
    }
});


var port = process.env.PORT || 3007;
http.listen(port, function(){
    console.log('running at port :' , port)
});
