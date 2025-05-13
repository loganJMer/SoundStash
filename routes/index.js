require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
var http = require('http');
var hbs = require('hbs');
var url = require('url');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { release } = require('os');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/userdata');



exports.checkUserExists = function (req, res){
	console.log("Checking if user exists")
	var username = req.body.username
	var email = req.body.email
	//check database users table for user
	db.get("SELECT 1 FROM users WHERE username = ? LIMIT 1", [username], function (err, row) {
        if (row) {
            return res.json({ conflict: "username" });
        }
        db.get("SELECT 1 FROM users WHERE email = ? LIMIT 1", [email], function (err2, row2) {
            if (row2) {
                return res.json({ conflict: "email" });
            }
            return res.json({ conflict: null });
        });
	});
}

exports.addUser = function (req, res){
	var username = req.body.username
	var email = req.body.email
	var password = req.body.password
	
	const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
	db.run(sql, [username, email, password], function(err) {
		
		console.log(`A row has been inserted with username: ${username}`);
		res.json({success: true})
	});
}

exports.signin = function (req, res) {
	console.log("Checking credentials")
	var usernameEmail = req.body.usernameEmail
	var password = req.body.password
	var authorized = false
	if(!usernameEmail.includes("@")){
		var username = usernameEmail
		db.all("SELECT username, password FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
				if(rows[i].username == username & rows[i].password == password) authorized = true;
		}
		if(authorized == false){
			res.json({auth: false})
			
		} else{

			// Generate JWT with the secret key from environment variables
			const token = jwt.sign({username: username}, process.env.JWT_SECRET, { expiresIn: '31d' });  // expires in 31 day

			// Set the token as an HTTP-only cookie
			res.cookie('auth_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',  // Secure cookie in production
				maxAge: 24 * 60 * 60 * 31000,  // 1 month expiration
				sameSite: 'Lax',
			});
				res.json({auth: true})
			}
		});
	} else{
		var email = usernameEmail
		db.all("SELECT username, email, password FROM users", function(err, rows){
			for(var i=0; i<rows.length; i++){
					if(rows[i].email == email & rows[i].password == password) {
						authorized = true;
						var username = rows[i].username;
						break;
					}
			}
			if(authorized == false){
				res.json({auth: false})
				
			} else{
				
				const token = jwt.sign({username: username}, process.env.JWT_SECRET, { expiresIn: '31d' });  // expires in 31 day

			// Set the token as an HTTP-only cookie
				res.cookie('auth_token', token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',  // Secure cookie in production
					maxAge: 24 * 60 * 60 * 31000,  // 1 month expiration
					sameSite: 'Lax',
				});
					res.json({auth: true});
			}
		});
	}
}

exports.verifyToken = function (req, res){
	const token = req.cookies.auth_token;
	if (!token) {
		console.log("No token provided")
		return res.json({ valid: false });
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			console.log("Token invalid")
			return res.json({ valid: false });
		}
		res.json({ valid: true , username: decoded.username });
	});
}

exports.logout = function (req, res) {
	console.log("Logging out")
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    res.json({ success: true });
}



function parseURL(req, res){
	var parseQuery = true; //parseQueryStringIfTrue
    var slashHost = true; //slashDenoteHostIfTrue
    var urlObj = url.parse(req.url, parseQuery , slashHost );
    console.log('path:');
    console.log(urlObj.path);
    console.log('query:');
    console.log(urlObj.query);
    //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
	return urlObj;

}


exports.search = async function(req, res) {

	try {

		const params = {
			key: process.env.CONSUMER_KEY,
			secret: process.env.CONSUMER_SECRET,
		}
		if(req.query.artist != '') {
			params.artist = req.query.artist
		}
		if(req.query.release_title != '') {
			params.release_title = req.query.release_title
		}
		if(req.query.genre != 'All genres') {
			params.genre = req.query.genre
		}
		const discogsRes = await axios.get('https://api.discogs.com/database/search', {
			params: params,
			headers: {
				'User-Agent': 'soundstash/1.0',
			},
		});
	
		res.json(discogsRes.data);
	  } catch (error) {
		console.error('Discogs API error:', error.message);
		res.status(500).json({ error: 'Discogs API error', details: error.message });
	  }
}

exports.favSong = function(req, res){
	let newFavSong = req.body.song
	var auth = req.headers.authorization;
	var tmp = auth.split(' ');
	var buf = Buffer.from(tmp[1], 'base64');
	var plain_auth = buf.toString();
	var credentials = plain_auth.split(':');
	var username = credentials[0];

	const sql = "UPDATE users SET song = ? WHERE username = ?"
	db.run(sql, [newFavSong, username], function(err){
		if(err){
			console.log(err)
			res.json({success: false})
		} else{
			console.log("Fav song for " + username + "updated")
			res.json({success: true})
		}
	})
	
}

exports.favAlbum = function(req, res){
	let newFavAlbum = req.body.album
	console.log("NEW FAV album: " + newFavAlbum)
	var auth = req.headers.authorization;
	var tmp = auth.split(' ');
	var buf = Buffer.from(tmp[1], 'base64');
	var plain_auth = buf.toString();
	var credentials = plain_auth.split(':');
	var username = credentials[0];

	const sql = "UPDATE users SET album = ? WHERE username = ?"
	db.run(sql, [newFavAlbum, username], function(err){
		if(err){
			console.log(err)
			res.json({success: false})
		} else{
			console.log("Fav album for " + username + " updated")
			res.json({success: true})
		}
	})
}

exports.users = function(req, res){
	db.all("SELECT username, password, isAdmin, song, album FROM users", function(err, rows){
		res.render('users', {title : 'Users:', userEntries: rows, isAdmin: req.isAdmin});
	})

}

exports.getAlbums = function(req, res) {
	var urlObj = parseURL(req, res);
	var path = urlObj.path; //expected form: /albums/albumName
	if(path === "/albums" || path === "/albums/"){
		albumName = " "
	}else{
		albumName = path.slice(path.lastIndexOf("/")+1);
	}

	let url = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album='+ albumName + '&api_key=' + API_KEY + '&format=json'
  
	http.req(url, function(apires) {
	  let albumData = ''

	  apires.on('data', function(chunk) {
		albumData += chunk
	  })
	  apires.on('end', function() {
		let albums = JSON.parse(albumData)
		if(albums.results && albums.results.albummatches){
			const matchedAlbums = albums.results.albummatches.album
			res.render('albums', {title: 'Albums', albums: matchedAlbums, search: decodeURIComponent(albumName), favSong: req.favSong, favAlbum: req.favAlbum})
		}
	  })
	}).end() 
}

exports.albumDetails = function(req, res) {
	var urlObj = parseURL(req, res)
	var path = urlObj.path
	var name = decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))
	path = path.slice(0, path.lastIndexOf('/'))
	var artist = decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))

	let url = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + API_KEY + '&artist=' + artist + '&album=' + name + '&format=json'

	http.req(url, function(apires) {
		let albumData = ''
  
		apires.on('data', function(chunk) {
		  albumData += chunk
		})
		apires.on('end', function() {
			
		let album = JSON.parse(albumData).album
		if(album){
			res.render('albumDetails', {title: 'Album Details', album: album})
		}
		})
	  }).end() 
}

exports.trackDetails = function(req, res) {
	var urlObj = parseURL(req, res)
	var path = urlObj.path
	var name = decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))
	path = path.slice(0, path.lastIndexOf('/'))
	var artist = decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))

	let url = 'http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=' + API_KEY + '&artist=' + artist + '&track=' + name + '&format=json'
	http.req(url, function(apires) {
		let trackData = ''
  
		apires.on('data', function(chunk) {
		  trackData += chunk
		})
		apires.on('end', function() {
			
		let track = JSON.parse(trackData).track
		if(track){
			res.render('trackDetails', {title: 'Track Details', track: track})
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