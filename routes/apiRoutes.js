const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const discogsController = require('../controllers/discogsController');

const { requireAuth } = require('../middleware/auth');
const { getCollection } = require('../middleware/getCollection');
const { getWishlist } = require('../middleware/getWishlist');

//auth routes
router.post('/checkUserExists', authController.checkUserExists);
router.post('/addUser', authController.addUser);
router.post('/signin', authController.signin);
router.get('/verifyToken', requireAuth, authController.verifyToken); //verify token
router.post('/logout', authController.logout); //logout user

//user routes
router.patch('/addAlbumCollection', requireAuth, getCollection, userController.addAlbumCollection); //add album to user collection
router.patch('/removeAlbumCollection', requireAuth, getCollection, userController.removeAlbumCollection); //remove album from user collection
router.get('/checkAlbumInCollection', requireAuth, getCollection, userController.checkAlbumInCollection); //add album to user collection
router.get('/getCollection', requireAuth, getCollection, userController.getCollection); //get user collection
router.get('/getCollectionPublic/:username', userController.getCollectionPublic); //get user collection public
router.patch('/addAlbumWishlist', requireAuth, getWishlist, userController.addAlbumWishlist); //add album to user Wishlist
router.patch('/removeAlbumWishlist', requireAuth, getWishlist, userController.removeAlbumWishlist); //remove album from user Wishlist
router.get('/checkAlbumInWishlist', requireAuth, getWishlist, userController.checkAlbumInWishlist); //add album to user Wishlist
router.get('/getWishlist', requireAuth, getWishlist, userController.getWishlist); //get user Wishlist
router.get('/getWishlistPublic/:username', userController.getWishlistPublic); //get user collection public

//discogs search routes
router.get('/search', discogsController.search); //search discogs general
router.get('/search/:albumId', discogsController.searchAlbum); //search discogs album
router.get('/masterSearch/:albumId', discogsController.masterSearch); //search discogs album
router.get('/searchVersions/:albumId', discogsController.searchVersions); //search album masters
router.get('/searchArtist/:artistId', discogsController.searchArtist); //search albums by artist

module.exports = router;