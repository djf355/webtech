// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.

"use strict";
var sql = require("sqlite3");
var db = new sql.Database("data.db");
 
// db.serialize(create);
//  
// function create() {
//  	db.run("create table if not exists projs (id, type, name, des)");
//  	var ps = db.prepare("insert into projs values (?, ?, ?, ?)");
//  	ps.run(1, 'Coursework', 'Dictionary', "In this project, the program takes in user input" +
//  	" in the form of random letters, and generates words from a dictionary, using" +
//  	" those letters. For example, if the user enters athlim, the output would be" +
//  	" am at hi hat him.. etc.");
//  	ps.run(2, 'Coursework', 'Infix/Prefix Calculator', "In this project, the coded program reads input" +
//  	" that can be calculated using the prefix or infix methods, both of which" +
//  	" are important methods within the programming language. It is able to" +
//  	" decide when the appropriate operator should be used, such as multiplication" +
//  	" before addition.");
//  	ps.run(3, 'iOS', 'Legends of the Byte Legionnaire', "An iOS gaming application was developed wherein the main" +
//  	" character is a legionnaire from ancient Greek times. His goal is to make it" +
//  	" back home in time to rescue his family. He has a limited amount of weapons," +
//  	" a sword and a shield. He has to jump over obstacles on his race home.");
//  	ps.run(4, 'Android', 'Pattern Separation', "This project is my thesis project, developed for" +
//  	" Android software, and is meant to be a gamification of a cognitive assessment." +
//  	" Within this game, it follows an escape-the-room storyline wherein the player" +
//  	" must solve puzzles - which are at the same time assessing some ability -" +
//  	" in order to escape the room in the given number of minutes.");
//  	ps.run(5, 'iOS', 'MyGuide', "This iOS application is a productivity/entertainment app" +
//  	" that was developed to help those who love TV shows and movies. The idea is" +
//  	" that people place their favorite TV shows in a list, and a calendar is" +
//  	" automatically filled showing the times that the TV show is airing. Moreover," +
//  	" movies entered will search for close-by cinemas that are currently showing" +
//  	" the movie that was requested.");
// }

var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var banned = [];
banUpperCase("./public/", "");




// Define the sequence of functions to be called for each request.  Make URLs
// lower case, ban upper case filenames, require authorisation for admin.html,
// and deliver static files from ./public.
app.use(lower);
app.use(ban)
app.use("/admin.html", auth);
var options = { setHeaders: deliverXHTML };
app.use(express.static("public", options));
app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


// Make the URL lower case.
function lower(req, res, next) {
    req.url = req.url.toLowerCase();
    next();
}

// Forbid access to the URLs in the banned list.
function ban(req, res, next) {
    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send("Filename not lower case");
            return;
        }
    }
    next();
}

// Redirect the browser to the login page.
function auth(req, res, next) {
    res.redirect("/login.html");
}

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, path, stat) {
    if (path.endsWith(".html")) {
        res.header("Content-Type", "application/xhtml+xml");
    }
}

// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(root + folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        var mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}

app.post("/api/test", function(req, res) {
	var key = req.body.value
	var value;
	
	
	if(key == "coursework") {
		value = db.all("select * from projs where type='Coursework'", function(err, rows) {
			if(err) {
				console.log("error")
			} else {
				console.log(rows)
			    res.send({"value": rows});
			}
		});	
	} else if(key == "ios") {
		value = db.all("select * from projs where type='iOS'", function(err, rows) {
			if(err) {
				console.log("error")
			} else {
				console.log(rows)
			    res.send({"value": rows});
			}
		});
	} else if(key == "android") {
		value = db.all("select * from projs where type='Android'", function(err, rows) {
			if(err) {
				console.log("error")
			} else {
				console.log(rows)
			    res.send({"value": rows});
			}
		});
	} else {
		value = "Incorrect query. Please try entering one of the suggested queries.";
		res.send({"value": value});
	}
	
})

function queryIt(err, rows) {
	if(err) {
		console.log("error")
	} else {
		console.log(rows)
	    res.send({"value": rows});
	}
}

function show(err, rows) {
    if (err) throw err;
    console.log(rows);
}
