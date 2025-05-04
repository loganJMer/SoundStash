var http = require('http');
var hbs = require('hbs');
var url = require('url');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/userdata');

const API_KEY = '7bda122e59e068345b71d5798a278d9a'


exports.signup = function (request, response){
	let invalidUsername = request.query.context == "userTaken"
	let badLogin = request.query.context == "badLogin"
	let userCreated = request.query.context == "userCreated"
	response.render('signup', {invalidUsername: invalidUsername, badLogin : badLogin, userCreated: userCreated})
}

exports.checkUserExists = function (request, response){

	var userExists = false;
	var userID = request.body.userID
	//check database users table for user
	db.all("SELECT userid FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
			if(rows[i].userid == userID) {
				userExists = true
				break;
			}
		}
		console.log(userExists)
		response.json({userExists: userExists})
	});

}

exports.addUser = function (request, response){
	var userID = request.body.userID
	var password = request.body.password
	
	const sql = "INSERT INTO users (userid, password, isAdmin, song, album) VALUES (?, ?, ?, ?, ?)";
	db.run(sql, [userID, password, 0, '/albums', '/albums'], function(err) {
		
		console.log(`A row has been inserted with userID: ${userID}`);
		response.json({success: true})
	});
}

exports.signin = function (request, response) {

	var auth = request.headers.authorization;
	// auth is a base64 representation of (username:password)
	//so we will need to decode the base64
	if(!auth){
 	 	//note here the setHeader must be before the writeHead
		response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
        response.writeHead(401, {'Content-Type': 'text/html'});
		console.log('No authorization found, send 401.');
 		response.end();
	}
	else{
	    console.log("Authorization Header: " + auth);
        //decode authorization header
		// Split on a space, the original auth
		//looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
        var tmp = auth.split(' ');

		// create a buffer and tell it the data coming in is base64
        var buf = Buffer.from(tmp[1], 'base64');

        // read it back out as a string
        //should look like 'ldnel:secret'
		var plain_auth = buf.toString();
        console.log("Decoded Authorization ", plain_auth);

        //extract the userid and password as separate strings
        var credentials = plain_auth.split(':');      // split on a ':'
        var username = credentials[0];
        var password = credentials[1];
        console.log("User: ", username);
        console.log("Password: ", password);

		var authorized = false;
		//check database users table for user
		db.all("SELECT userid, password FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
		      if(rows[i].userid == username & rows[i].password == password) authorized = true;
		}
		if(authorized == false){
 	 	   //we had an authorization header by the user:password is not valid
		   response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
           response.writeHead(401, {'Content-Type': 'text/html'});
		   console.log('No authorization found, send 401.');
 		   response.end();
		} else{
		   response.json({auth: true})
		}
		});
	}
}

exports.authenticate = function (request, response, next){
    /*
	Middleware to do BASIC http 401 authentication
	*/
    var auth = request.headers.authorization;
	// auth is a base64 representation of (username:password)
	//so we will need to decode the base64
	if(!auth){
		console.log('No authorization found. Redirecting to signup');
		response.redirect('/signup?context=auth_failed');
	}
	else{
	    console.log("Authorization Header: " + auth);
        //decode authorization header
		// Split on a space, the original auth
		//looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
        var tmp = auth.split(' ');

		// create a buffer and tell it the data coming in is base64
        var buf = Buffer.from(tmp[1], 'base64');

        // read it back out as a string
        //should look like 'ldnel:secret'
		var plain_auth = buf.toString();
        console.log("Decoded Authorization ", plain_auth);

        //extract the userid and password as separate strings
        var credentials = plain_auth.split(':');      // split on a ':'
        var username = credentials[0];
        var password = credentials[1];
        console.log("User: ", username);
        console.log("Password: ", password);

		var authorized = false;
		//check database users table for user
		db.all("SELECT userid, password, isAdmin, song, album FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
		      if(rows[i].userid == username & rows[i].password == password){
				authorized = true;
				request.isAdmin = rows[i].isAdmin
				request.favSong = rows[i].song
				request.favAlbum = rows[i].album
			  }
		}
		if(authorized == false){
		    console.log("Invalid credentials. Redirecting to signup")
			response.redirect("/signup?context=auth_failed");
		}
        else
		  next();
		});
	}

	//notice no call to next()

}


function parseURL(request, response){
	var parseQuery = true; //parseQueryStringIfTrue
    var slashHost = true; //slashDenoteHostIfTrue
    var urlObj = url.parse(request.url, parseQuery , slashHost );
    console.log('path:');
    console.log(urlObj.path);
    console.log('query:');
    console.log(urlObj.query);
    //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
	return urlObj;

}

exports.favSong = function(request, response){
	let newFavSong = request.body.song
	var auth = request.headers.authorization;
	var tmp = auth.split(' ');
	var buf = Buffer.from(tmp[1], 'base64');
	var plain_auth = buf.toString();
	var credentials = plain_auth.split(':');
	var username = credentials[0];

	const sql = "UPDATE users SET song = ? WHERE userid = ?"
	db.run(sql, [newFavSong, username], function(err){
		if(err){
			console.log(err)
			response.json({success: false})
		} else{
			console.log("Fav song for " + username + "updated")
			response.json({success: true})
		}
	})
	
}

exports.favAlbum = function(request, response){
	let newFavAlbum = request.body.album
	console.log("NEW FAV album: " + newFavAlbum)
	var auth = request.headers.authorization;
	var tmp = auth.split(' ');
	var buf = Buffer.from(tmp[1], 'base64');
	var plain_auth = buf.toString();
	var credentials = plain_auth.split(':');
	var username = credentials[0];

	const sql = "UPDATE users SET album = ? WHERE userid = ?"
	db.run(sql, [newFavAlbum, username], function(err){
		if(err){
			console.log(err)
			response.json({success: false})
		} else{
			console.log("Fav album for " + username + " updated")
			response.json({success: true})
		}
	})
}

exports.users = function(request, response){
	db.all("SELECT userid, password, isAdmin, song, album FROM users", function(err, rows){
		response.render('users', {title : 'Users:', userEntries: rows, isAdmin: request.isAdmin});
	})

}

exports.getAlbums = function(request, response) {
	var urlObj = parseURL(request, response);
	var path = urlObj.path; //expected form: /albums/albumName
	if(path === "/albums" || path === "/albums/"){
		albumName = " "
	}else{
		albumName = path.slice(path.lastIndexOf("/")+1);
	}

	let url = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album='+ albumName + '&api_key=' + API_KEY + '&format=json'
  
	http.request(url, function(apiResponse) {
	  let albumData = ''

	  apiResponse.on('data', function(chunk) {
		albumData += chunk
	  })
	  apiResponse.on('end', function() {
		let albums = JSON.parse(albumData)
		if(albums.results && albums.results.albummatches){
			const matchedAlbums = albums.results.albummatches.album
			response.render('albums', {title: 'Albums', albums: matchedAlbums, search: decodeURIComponent(albumName), favSong: request.favSong, favAlbum: request.favAlbum})
		}
	  })
	}).end() 
}

exports.albumDetails = function(request, response) {
	var urlObj = parseURL(request, response)
	var path = urlObj.path
	var name = decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))
	path = path.slice(0, path.lastIndexOf('/'))
	var artist = decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))

	let url = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + API_KEY + '&artist=' + artist + '&album=' + name + '&format=json'

	http.request(url, function(apiResponse) {
		let albumData = ''
  
		apiResponse.on('data', function(chunk) {
		  albumData += chunk
		})
		apiResponse.on('end', function() {
			
		let album = JSON.parse(albumData).album
		if(album){
			response.render('albumDetails', {title: 'Album Details', album: album})
		}
		})
	  }).end() 
}

exports.trackDetails = function(request, response) {
	var urlObj = parseURL(request, response)
	var path = urlObj.path
	var name = decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))
	path = path.slice(0, path.lastIndexOf('/'))
	var artist = decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))

	let url = 'http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=' + API_KEY + '&artist=' + artist + '&track=' + name + '&format=json'
	http.request(url, function(apiResponse) {
		let trackData = ''
  
		apiResponse.on('data', function(chunk) {
		  trackData += chunk
		})
		apiResponse.on('end', function() {
			
		let track = JSON.parse(trackData).track
		if(track){
			response.render('trackDetails', {title: 'Track Details', track: track})
		}
		})
	  }).end() 
}

hbs.registerHelper('encode', function(name){
	return encodeURIComponent(name)
})

hbs.registerHelper('plus', function(int){
	return int + 1
})

hbs.registerHelper('image', function(images){
	let imgURL = ""
	if(images){
		imgURL = images[images.length - 1]["#text"]
	}
	return imgURL
})

hbs.registerHelper('toSeconds', function(int){
	return int / 1000
})

hbs.registerHelper('favourite', function(text){
	if(text == "/albums"){
		return "None"
	} else{
		return decodeURIComponent(text.slice(text.lastIndexOf("/") + 1))
	}
})