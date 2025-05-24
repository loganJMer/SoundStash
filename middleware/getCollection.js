const db = require('../database');

function getCollection(req, res, next) {

    const id = req.user.id;

    db.get('SELECT collection FROM collections WHERE id = ?', [id], (err, row) => {
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