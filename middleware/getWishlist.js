const db = require('../database');

function getWishlist(req, res, next) {

    const username = req.user.username;

    db.get('SELECT wishlist FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        let wishlist = [];
        try {
            wishlist = JSON.parse(row.wishlist || '[]');
            req.wishlist = wishlist;
            next();
        } catch (e) {
            return res.status(500).json({ error: 'Invalid wishlist data' });
        }
    });

}

module.exports = { getWishlist };