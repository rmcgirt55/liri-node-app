require("dotenv").config();
const keys = require("./keys.js");
let inquirer = require("inquirer");
let moment = require("moment");
moment().format();
let fs = require("fs");
let axios = require("axios");
var Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);


//requesting the name of the user
inquirer
  .prompt([
    {
      type: "input",
      message: "What is your name?",
      name: "username"
    },
    {
        type: "input",
        message: "What is your age?",
        name: "age"
      },
    {
      type: "list",
      message: "What are you searching for: concerts, spotify songs, movies?",
      choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
      name: "choice"
    },
  ])
  //concert-this
  .then(function (res) {
    if (res.choice === "concert-this") {
      console.log("\n**********************");
      console.log(`\nHello ${res.username}`);
      console.log(`\nAge ${res.age}`);
      console.log("\n**********************");
      //asking about an artist or band
      inquirer
        .prompt([
          {
            type: "input",
            message: "Who are you searching for?",
            name: "artist"
          }
        ]).then(function (result) {
          let artist = result.artist;
          // Bands in Town api
          let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
          //API outputs
          if(result.artist == ""){
            console.log("Enter an artist");
          } else {
            axios.get(queryUrl).then(
              function (response) {
                
                //for loop resonse data info
                for (let i = 0; i < response.data.length; i++) {
                    
                    //moment() npm
                  let date = moment(response.data[i].datetime).format('MM/DD/YYYY')
                  console.log("\n**********************");
                  console.log(`Venue name:  ${response.data[i].venue.name}`);
                  console.log(`Country:  ${response.data[i].venue.country}`);
                  console.log(`Date:  ${date}`);
                  console.log("**********************");
                }
                //submit to log.txt
                fs.appendFile("log.txt", `\nArtist: ${artist}`, function (err) {
                  
                  if (err) {
                    console.log(err);
                  }
                  
                  else {
                    console.log(`Artist ${artist.toUpperCase()} added to log.txt file !`);
                  }
                });
              })
          }
      
        })
    } else if (res.choice === "spotify-this-song") {
      console.log("\n**********************");
      console.log(`\nHello ${res.username}`);
      console.log("\n**********************");
      //asking about Spotify
      inquirer
        .prompt([
          {
            type: "input",
            message: "What track are you interested?",
            name: "track"
          }
        ])
        .then(function (result) {
          if (result.track == "") {
            result.track = "The Sign";
            spotify
              .search({ type: 'track', query: result.track })
              .then(function (response) {

                console.log("\n**********************");
                console.log("\n**********************");
                console.log(`Song:  ${response.tracks.items[7].name}`);
                console.log(`Artist: ${response.tracks.items[7].album.artists[0].name}`);
                console.log(`Spotify Preview: ${response.tracks.items[7].album.external_urls.spotify}`);
                console.log(`Album: ${response.tracks.items[7].album.name}`);
                console.log(`Release Year: ${response.tracks.items[7].album.release_date}`);
                console.log(`Preview: ${response.tracks.items[7].preview_url}`);
                console.log("\n**********************");
                //summiting song to log.txt
                fs.appendFile("log.txt", `\nSong: ${result.track}`, function (err) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log(`Song ${result.track.toUpperCase()} added to log.txt file !`);
                  }
                });
              })
              .catch(function (err) {
                console.log(err);
              });
          } else {
            spotify
              .search({ type: 'track', query: result.track })
              .then(function (response) {

                console.log("\n**********************");
                for (let i = 0; i < response.tracks.items.length; i++) {
                  console.log("\n**********************");
                  console.log(`Song:  ${response.tracks.items[i].name}`);
                  console.log(`Artist: ${response.tracks.items[i].album.artists[0].name}`);
                  console.log(`Spotify Preview: ${response.tracks.items[i].album.external_urls.spotify}`);
                  console.log(`Album: ${response.tracks.items[i].album.name}`);
                  console.log(`Release Year: ${response.tracks.items[i].album.release_date}`);
                  console.log(`Preview: ${response.tracks.items[i].preview_url}`);
                  console.log("\n**********************");
                }
                //adding song to log.txt
                fs.appendFile("log.txt", `\nSong: ${result.track}`, function (err) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log(`Song ${result.track.toUpperCase()} added to log.txt file !`);
                  }
                });
              })
              .catch(function (err) {
                console.log(err);
              });
          }

        })
      //Do-what-it-says
    } else if (res.choice === "do-what-it-says") {
      fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
          return console.log(error);
        }
        spotify
          .search({ type: 'track', query: data })
          .then(function (response) {
            console.log("\n**********************");
            for (let i = 0; i < response.tracks.items.length; i++) {
              console.log("\n**********************");
              console.log(`Song:  ${response.tracks.items[i].name}`);
              console.log(`Artist: ${response.tracks.items[i].album.artists[0].name}`);
              console.log(`Spotify Preview: ${response.tracks.items[i].album.external_urls.spotify}`);
              console.log(`Album: ${response.tracks.items[i].album.name}`);
              console.log(`Release Year: ${response.tracks.items[i].album.release_date}`);
              console.log(`Preview: ${response.tracks.items[i].preview_url}`);
              console.log("\n**********************");
            }
            //adding movies to log file
            fs.appendFile("log.txt", `\nSong: ${data}`, function (err) {
              if (err) {
                console.log(err);
              }
              else {
                console.log(`Song ${data.toUpperCase()} summited results to log.txt file !`);
              }
            });
          })

      })

    }
    // movie-this OMDB
    else if (res.choice === "movie-this") {
      console.log("\n**********************");
      console.log(`\nHello ${res.username}`);
      console.log("\n**********************");
      inquirer
        .prompt([
          {
            type: "input",
            message: "What movie are you interested?",
            name: "movie"
          }
        ]).then(function (result) {
          //outputs default (Mr. Nobody)
          if (result.movie == "") {
           
            axios.get("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy").then(
              function (response) {
                console.log("\n**********************");
                console.log(`Title: ${response.data.Title}`);
                console.log(`Year: ${response.data.Year}`);
                console.log(`IMBD Rating: ${response.data.imdbRating}`);
                console.log(`Country: ${response.data.Country}`);
                console.log(`Language: ${response.data.Language}`);
                console.log(`Actors: ${response.data.Actors}`);
                console.log(`Plot: ${response.data.Plot}`);
                console.log("\n**********************");
              })
            //add to log.tx 
            fs.appendFile("log.txt", `\nMovie: ${'Mr.Nobody'}`, function (err) {

              if (err) {
                console.log(err);
              }

              else {
                console.log(`Movie ${'Mr.Nobody'} Added to log.txt file!`);
              }

            });
          }
          else {
            let ombdMovie = function () {
              axios.get("http://www.omdbapi.com/?t=" + result.movie + "&y=&plot=short&apikey=trilogy").then(
                function (response) {
                  // No matches
                  if (response.data.Error) {
                    console.log('Movie not found!');
                  }
                  //movie found
                  else if (result.movie) {
                    console.log("\n**********************");
                    console.log(`Title: ${response.data.Title}`);
                    console.log(`Year: ${response.data.Year}`);
                    console.log(`IMBD Rating: ${response.data.imdbRating}`);
                    console.log(`Country: ${response.data.Country}`);
                    console.log(`Language: ${response.data.Language}`);
                    console.log(`Actors: ${response.data.Actors}`);
                    console.log(`Plot: ${response.data.Plot}`);
                    console.log("\n**********************");
                  }
                })
            }
            ombdMovie();
            //summiting results (movies) to log file
            fs.appendFile("log.txt", `\nMovie: ${result.movie}`, function (err) {

              if (err) {
                console.log(err);
              }

              else {
                console.log(`Movie ${result.movie.toUpperCase()} Added to log.txt file !`);
              }
            });
          }
        })
    }
  })