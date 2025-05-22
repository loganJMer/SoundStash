const db = require('../database');




exports.addAlbum = function(req, res) {

}

exports.checkAlbumInCollection = function(req, res) {
    const albumId = req.body.albumId;
    const collection = req.collection;

    // Check if the album is already in the collection
    const albumExists = collection.some(album => album.id === albumId);

    res.json({ exists: albumExists });
}