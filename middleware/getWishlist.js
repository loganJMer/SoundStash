const db = require('../database');

function getWishlist(req, res, next) {

    const id = req.user.id;

    db.get('SELECT wishlist FROM collections WHERE id = ?', [id], (err, row) => {
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