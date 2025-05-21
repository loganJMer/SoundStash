//some logger middleware functions
exports.methodLogger = function(req, res, next){
           console.log("METHOD LOGGER");
           console.log("================================");
           console.log("METHOD: " + req.method);
           console.log("URL:" + req.url);
           next(); //call next middleware registered
};

exports.headerLogger = function(req, res, next){
           console.log("HEADER LOGGER:")
           console.log("Headers:")
           for(k in req.headers) console.log(k);
           next(); //call next middleware registered
};