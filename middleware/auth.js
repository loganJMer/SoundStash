const jwt = require('jsonwebtoken');


function requireAuth(req, res, next) {
	const token = req.cookies && req.cookies.auth_token;
	if (!token) return res.status(401).json({ error: 'Unauthorized: No token' });
	try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
        next();
	} catch (err) {
		return res.status(401).json({ error: 'Unauthorized: Invalid token' });
	}
}

module.exports = { requireAuth };