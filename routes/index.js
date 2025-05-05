var http = require('http');
var hbs = require('hbs');
var url = require('url');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/userdata');


exports.signinPage = function (request, response){
	let badLogin = request.query.context == "badLogin"
	response.render('signin', {badLogin : badLogin})
}

exports.signup = function (request, response) {
	let invalidUsername = request.query.context == "userTaken"
	let badEmail = request.query.context == "badEmail"
	response.render('signup', {invalidUsername: invalidUsername, badEmail: badEmail})
}

exports.checkUserExists = function (request, response){

	var username = request.body.username
	var email = request.body.email
	//check database users table for user
	db.get("SELECT 1 FROM users WHERE username = ? LIMIT 1", [username], function (err, row) {
        if (row) {
            return response.json({ conflict: "username" });
        }
        db.get("SELECT 1 FROM users WHERE email = ? LIMIT 1", [email], function (err2, row2) {
            if (row2) {
                return response.json({ conflict: "email" });
            }
            return response.json({ conflict: null });
        });
	});
}

exports.addUser = function (request, response){
	var username = request.body.username
	var email = request.body.email
	var password = request.body.password
	
	const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
	db.run(sql, [username, email, password], function(err) {
		
		console.log(`A row has been inserted with username: ${username}`);
		response.json({success: true})
	});
}

exports.signin = function (request, response) {

	var username = response.body.username
	var email = response.body.email
	var password = response.body.password
	if(username){
		db.all("SELECT username, password FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
				if(rows[i].username == username & rows[i].password == password) authorized = true;
		}
		if(authorized == false){
			//STAY ON SIGN IN PAGE SEND BAD USERNAME
			
		} else{
			const payload = { username };

			// Generate JWT with the secret key from environment variables
			const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '31d' });  // expires in 31 day

			// Set the token as an HTTP-only cookie
			response.cookie('auth_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',  // Secure cookie in production
				maxAge: 24 * 60 * 60 * 31000,  // 1 month expiration
				sameSite: 'Strict',
			});
				response.json({auth: true})
			}
		});
	} else{
		db.all("SELECT username, email, password FROM users", function(err, rows){
			for(var i=0; i<rows.length; i++){
					if(rows[i].email == email & rows[i].password == password) authorized = true;
			}
			if(authorized == false){
				//STAY ON SIGN IN PAGE SEND BAD EMAIL
				
			} else{
				var username = rows[i].username;
				const payload = { username };

				const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '31d' });  // expires in 31 day

				// Set the token as an HTTP-only cookie
				response.cookie('auth_token', token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',  // Secure cookie in production
					maxAge: 24 * 60 * 60 * 31000,  // 1 month expiration
					sameSite: 'Strict',
				});
					
				}
			});
	}
}


exports.authenticate = function (request, response, next){

	
	var auth = false;
	const token = request.cookies.auth_token;
	if(!token){
		request.username = null
		next()
	}
	
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
			request.username = null
            next()
        }
        request.username = decoded;
        next();  // Continue to the next middleware/route handler
    });
	
	next();
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

	const sql = "UPDATE users SET song = ? WHERE username = ?"
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

	const sql = "UPDATE users SET album = ? WHERE username = ?"
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
	db.all("SELECT username, password, isAdmin, song, album FROM users", function(err, rows){
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