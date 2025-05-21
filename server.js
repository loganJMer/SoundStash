require('dotenv').config();
const cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var  app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000


app.locals.pretty = true; //to generate pretty view-source code in browser

//read routes modules
const routes = require('./routes/apiRoutes');
const {methodLogger, headerLogger} = require('./middleware/loggers');



//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cookieParser())
app.use(favicon(path.join(__dirname,'favicon.ico')));
app.use(logger('dev'));

//loggers for development
 //app.use(methodLogger);
 //app.use(headerLogger);

//use routes
app.use('/api', routes);

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
	}
})
