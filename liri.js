require("dotenv").config();

var axios = require("axios");
var moment = require('moment'); 
var fs = require("fs");
var fs = require("fs");
var keys = require("./keys.js");

var Spotify = require("node-spotify-api"); 
var spotify = new Spotify(keys.spotify);


var search = process.argv[2];
var artists = process.argv.splice(3).join(' ');
commandInputs(userInputs,artists);

function run (search, artists) {
switch (search) {
    case "concert-this":
        concertThis(artists);
        break;
    case "spotify-this-song":
        spotifyThis(artists);
        break;
    case "movie-this":
        movieThis(artists);
    case "do-what-it-says" :
        commandIt();
        break;
}

    
// Bands in Town
function  concertThis() {

    axios.get("https://rest.bandsintown.com/artists/" + artists + "/events?app_id=codingbootcamp")
    .then(function (response) {
        if (response.data[0] != undefined) {
            console.log("\n-------------------------------------\n")
            console.log(`Venue: ${response.dat[0].venue.name}`);
            console.log(`City: ${respose.data[0].venue.city}`);
            console.log(`Date: ${moment(response.data[0].datetime).format('MM/DD/YYYY')}`);
            console.log("\n-------------------------------------\n")
        
        } else{
            console.log("empty result : (");
        }
        })
    

        //spotify
        function spotifyThis() {
            if (!artists) {
                artists = "The Sign";
            }
            
            spotify.search({
                
                    type: 'track',
                    query: artists,
                    limit: 1
                },
                function (err, data) {
                    if (err) {
                        return console.log(`Error occurred: $ {err}`);
                    }
                    console.log("\n-----------------------\n");
                    console.log(`Artist: ${data.tracks.items[0].artist[0].name}`);
                    console.log(`Track: ${datatracks.items[0].name}`);
                    console.log(`preview: ${data.tracks.items[0].preview_url}`);
                    console.log(`Album: ${data.tracks.items[0].album.name}`);
                    console.log("\n-----------------------\n");
                });
            }



        //OMDB
        
function movieThis(artists){
    if (!artists) {
        artists = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + artists + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
        console.log("\n-----------------------------------------------------------\n");
        console.log(`Title: ${response.data.Title}`);
        console.log(`Year: ${response.data.Year}`);
        console.log(`IMDB Rating: ${response.data.imdbRating}`);
        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
        console.log(`Country: ${response.data.Country}`);
        console.log(`Language: ${response.data.Language}`);
        console.log(`Plot: ${response.data.Plot}`);
        console.log(`Actors: ${response.data.Actors}`);
        console.log("\n-----------------------------------------------------------\n");
    })
}        
       

//function for reading out of random.txt file  
function commandIt() {
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err) { 
			return console.log(err);
		}
        var dataArr = data.split(",");
        
        search = dataArr[0];
         artists = dataArr[1];
         spotifyThis(artists);
	});
}

run (search, artists);