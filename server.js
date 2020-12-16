// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require('fs');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Serving static files via public folder:
app.use(express.static("public"));

// Notes DB retrieval
// =============================================================
//JSONParser parser = new JSONParser();

var notes = [""];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  // res.send("Welcome to the Star Wars Page!")
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Displays notes.html
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  //return res.json(characters);
});

//Gets the db.json file
app.get("/api/notes", function(req, res) {
 
  //Just a test to see whats in our db.
  notes = JSON.parse(getDBJSON());
  
  return res.json(notes);

});

// Displays a single character, or returns false
app.get("/api/notes/:note", function(req, res) {
  var chosen = req.params.note;

  console.log(chosen);

  // for (var i = 0; i < notes.length; i++) {
  //   if (chosen === notes[i].title) {
  //     return res.json(characters[i]);
  //   }
  // }
  

  return res.json(false);
});


app.delete("/api/notes/:id", function(req, res) {
  var chosen = req.params.id;
  
  notes = JSON.parse(getDBJSON());
  
  let newNotes = notes.filter(function(element){
    return element.id != chosen;
  });

  writeToDBJSON(newNotes);

});



// Create New Characters - takes in JSON input
app.post("/api/notes", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware

  //Get the body of the html object,
  //Push it to our array
  //Push our array to the json file.

  notes = JSON.parse(getDBJSON());
  var note = req.body;
  notes.push(note);
  //write to file
  let stringify = resetSequenceID(notes);
  console.log(stringify);
  resetSequenceID(stringify);
  writeToDBJSON(stringify);
  res.json(note);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


function getDBJSON(){

  //console.log(path.join(__dirname,"/db/db.json"));
  var jsonPath = path.join(__dirname, "/db/db.json");
  var rawData =  fs.readFileSync(jsonPath, (err,data)=>{
    if(err) throw err;
  });

  return rawData;

}

function writeToDBJSON(objectToWrite){
  console.log(objectToWrite);

 let  stringify = JSON.stringify(objectToWrite);
  var jsonPath = path.join(__dirname, "/db/db.json");
  fs.writeFileSync(jsonPath, stringify, (err)=>{
    if(err) throw err;
  });
  
}

function resetSequenceID(object){
  let quickObj = object;
  for(var x=0; x<object.length;x++){
    quickObj[x].id = x;
  }
  return quickObj;
}