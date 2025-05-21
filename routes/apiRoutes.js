const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const discogsController = require('../controllers/discogsController');


router.post('/checkUserExists', authController.checkUserExists);
router.post('/addUser', authController.addUser);
router.post('/signin', authController.signin);
router.get('/verifyToken', authController.verifyToken); //verify token
router.post('/logout', authController.logout); //logout user
router.post('/addAlbum', userController.addAlbum); //add album to user collection
router.get('/search', discogsController.search); //search discogs general
router.get('/search/:albumId', discogsController.searchAlbum); //search discogs album
router.get('/searchVersions/:albumId', discogsController.searchVersions); //search album masters
router.get('/searchArtist/:artistId', discogsController.searchArtist); //search albums by artist

module.exports = router;