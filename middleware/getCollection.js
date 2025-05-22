const db = require('../database');

function getCollection(req, res, next) {

    const username = req.user.username;

    db.get('SELECT collection FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        let collection = [];
        try {
            collection = JSON.parse(row.collection || '[]');
            req.collection = collection;
            next();
        } catch (e) {
            return res.status(500).json({ error: 'Invalid collection data' });
        }
    });

}

module.exports = { getCollection };