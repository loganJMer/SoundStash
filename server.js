require('dotenv').config();
var http = require('http');
const cookieParser = require('cookie-parser');
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
function methodLogger(req, res, next){
		   console.log("METHOD LOGGER");
		   console.log("================================");
		   console.log("METHOD: " + req.method);
		   console.log("URL:" + req.url);
		   next(); //call next middleware registered
}
function headerLogger(req, res, next){
		   console.log("HEADER LOGGER:")
		   console.log("Headers:")
           for(k in req.headers) console.log(k);
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

app.post('/api/checkUserExists', routes.checkUserExists);
app.post('/api/addUser', routes.addUser);
app.post('/api/signin', routes.signin);
app.get('/api/verifyToken', routes.verifyToken); //verify token
app.post('/api/logout', routes.logout); //logout user
app.get('/api/search', routes.search); //search discogs general
app.get('/api/search/:albumId', routes.searchAlbum); //search discogs album

//app.use(routes.authenticate); //authenticate user



//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
	}
})
