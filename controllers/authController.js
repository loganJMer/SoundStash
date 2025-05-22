const db = require('../database');
const jwt = require('jsonwebtoken');

exports.checkUserExists = function (req, res){

	const username = req.body.username
	const email = req.body.email
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
	const username = req.body.username
	const email = req.body.email
	const password = req.body.password
	
	const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
	db.run(sql, [username, email, password], function(err) {
		if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }
		res.json({success: true})
	});
}

exports.signin = function (req, res) {
	const usernameEmail = req.body.usernameEmail
	const password = req.body.password
	let authorized = false
	if(!usernameEmail.includes("@")){
		const username = usernameEmail
		db.all("SELECT username, password FROM users", function(err, rows){
		for(let i=0; i<rows.length; i++){
				if(rows[i].username === username & rows[i].password === password) authorized = true;
		}
		if(!authorized){
			return res.json({auth: false})
			
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
		const email = usernameEmail
		db.all("SELECT username, email, password FROM users", function(err, rows){
			for(let i=0; i<rows.length; i++){
					if(rows[i].email == email & rows[i].password == password) {
						authorized = true;
						var username = rows[i].username;
						break;
					}
			}
			if(!authorized){
				return res.json({auth: false})
				
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

exports.verifyToken = function (req, res) {
	const username = req.user.username;
	if(username == null){
		return res.json({ valid: false });
	}
	res.json({ valid: true, username: username });
}

exports.logout = function (req, res) {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    res.json({ success: true });
}