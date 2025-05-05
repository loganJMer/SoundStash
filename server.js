require('dotenv').config();
var http = require('http');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var  app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper

app.locals.pretty = true; //to generate pretty view-source code in browser

//read routes modules
var routes = require('./routes/index');

//some logger middleware functions
function methodLogger(request, response, next){
		   console.log("METHOD LOGGER");
		   console.log("================================");
		   console.log("METHOD: " + request.method);
		   console.log("URL:" + request.url);
		   next(); //call next middleware registered
}
function headerLogger(request, response, next){
		   console.log("HEADER LOGGER:")
		   console.log("Headers:")
           for(k in request.headers) console.log(k);
		   next(); //call next middleware registered
}





//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cookieParser())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.get('/signup', routes.signup);
app.post('/checkUserExists', routes.checkUserExists);
app.post('/addUser', routes.addUser);
app.post('/signin', routes.signin);
app.use(routes.authenticate); //authenticate user

//routes
app.post('/favSong', routes.favSong)
app.post('/favAlbum', routes.favAlbum)
app.get('/albums*', routes.getAlbums);
app.get('/users', routes.users);
app.get('/album/*', routes.albumDetails);
app.get('/track/*', routes.trackDetails);

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('Admin.   user: ldnel password: secret')
		console.log('Guest.   user: frank password: secret2')
		console.log('Or make your own user')
		console.log('http://localhost:3000/albums')
	}
})
