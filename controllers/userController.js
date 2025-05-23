const db = require('../database');

exports.addAlbumCollection = function(req, res) {

    const username = req.user.username;
    const albumData = req.body.albumData;
    const primaryImage = req.body.primaryImage;
    const isMaster = req.body.isMaster;
    const collection = req.collection;
    const album = {
        title: albumData.title,
        artists: albumData.artists[0].name,
        year: albumData.year,
        genres: albumData.genres,
        id: albumData.id,
        primaryImage: primaryImage,
        isMaster: isMaster
    };

    // Check if the album is already in the collection
    const albumExists = collection.some(album => album.id === albumData.id);
    if (albumExists) {
        return res.status(400).json({ error: 'Album already exists in collection' });
    }
    // Add the album to the collection
    collection.push(album);
    let collectionString = JSON.stringify(collection);
    const sql = "UPDATE users SET collection = ? WHERE username = ?";
    db.run(sql, [collectionString, username], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true });
    });


}

exports.removeAlbumCollection = function(req, res) {

    const username = req.user.username;
    const albumId = req.body.albumId;
    let collection = req.collection;

    const albumIndex = collection.findIndex(album => album.id === albumId);
    if (albumIndex === -1) {
        return res.status(404).json({ error: 'Album not found in collection' });
    }
    // Remove the album from the collection
    collection.splice(albumIndex, 1);
    let collectionString = JSON.stringify(collection);
    const sql = "UPDATE users SET collection = ? WHERE username = ?";
    db.run(sql, [collectionString, username], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true });
    });
}

exports.checkAlbumInCollection = function(req, res) {
    const albumId = req.query.albumId;
    const collection = req.collection;
    // Check if the album is already in the collection
    const albumInCollection = collection.some(album => album.id === parseInt(albumId));
    res.json({ albumInCollection: albumInCollection });
}

exports.getCollection = function(req, res) {
    const collection = req.collection;
    res.json({ collection: collection });
}

exports.getCollectionPublic = function(req, res) {
    const username = decodeURIComponent(req.params.username);
    // Check if the username is provided
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

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
            res.json({ collection: collection });
        } catch (e) {
            return res.status(500).json({ error: 'Invalid collection data' });
        }
    });

}

exports.getWishlistPublic = function(req, res) {

    const username = decodeURIComponent(req.params.username);
    // Check if the username is provided
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

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
            res.json({ wishlist: wishlist });
        } catch (e) {
            return res.status(500).json({ error: 'Invalid wishlist data' });
        }
    });

}


exports.addAlbumWishlist = function(req, res) {

    const username = req.user.username;
    const albumData = req.body.albumData;
    const primaryImage = req.body.primaryImage;
    const isMaster = req.body.isMaster;
    const wishlist = req.wishlist;
    const album = {
        title: albumData.title,
        artists: albumData.artists[0].name,
        year: albumData.year,
        genres: albumData.genres,
        id: albumData.id,
        primaryImage: primaryImage,
        isMaster: isMaster
    };

    // Check if the album is already in the wishlist
    const albumExists = wishlist.some(album => album.id === albumData.id);
    if (albumExists) {
        return res.status(400).json({ error: 'Album already exists in wishlist' });
    }
    // Add the album to the wishlist
    wishlist.push(album);
    let wishlistString = JSON.stringify(wishlist);
    const sql = "UPDATE users SET wishlist = ? WHERE username = ?";
    db.run(sql, [wishlistString, username], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true });
    });


}

exports.removeAlbumWishlist = function(req, res) {

    const username = req.user.username;
    const albumId = req.body.albumId;
    let wishlist = req.wishlist;

    const albumIndex = wishlist.findIndex(album => album.id === albumId);
    if (albumIndex === -1) {
        return res.status(404).json({ error: 'Album not found in wishlist' });
    }
    // Remove the album from the wishlist
    wishlist.splice(albumIndex, 1);
    let wishlistString = JSON.stringify(wishlist);
    const sql = "UPDATE users SET wishlist = ? WHERE username = ?";
    db.run(sql, [wishlistString, username], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true });
    });
}

exports.checkAlbumInWishlist = function(req, res) {
    const albumId = req.query.albumId;
    const wishlist = req.wishlist;
    // Check if the album is already in the wishlist
    const albumInWishlist = wishlist.some(album => album.id === parseInt(albumId));
    res.json({ albumInWishlist: albumInWishlist });
}

exports.getWishlist = function(req, res) {
    const wishlist = req.wishlist;
    res.json({ wishlist: wishlist });
}