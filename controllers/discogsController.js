const axios = require('axios');
const USER_AGENT = 'soundstash/1.0';

async function getDiscogsData(url, params = {}) {
    console.log('Fetching data from Discogs API:', url, params);
    try {
        const response = await axios.get(url, {
            params: {
                key: process.env.CONSUMER_KEY,
                secret: process.env.CONSUMER_SECRET,
                ...params,
            },
            headers: {
                'User-Agent': USER_AGENT,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Discogs API error:', error.message);
        throw new Error(error.message);
    }
}


exports.search = async function(req, res) {

	try {

		const params = {
            format: 'Vinyl',
            artist: req.query.artist || '',
            release_title: req.query.release_title || '',
            genre: req.query.genre !== 'All genres' ? req.query.genre : undefined,
            type: req.query.type !== 'release' ? req.query.type : undefined,
        };
		const data = await getDiscogsData('https://api.discogs.com/database/search', params);
		res.json(data);
	  } catch (error) {
		console.error('Discogs API error:', error.message);
		res.status(500).json({ error: 'Discogs API error', details: error.message });
	  }
}

exports.searchAlbum = async function(req, res) {
	try {
		const data = await getDiscogsData(`https://api.discogs.com/masters/${req.params.albumId}`);
		res.json(data);
	  } catch (error) {
		console.error('Discogs API error:', error.message);
		res.status(500).json({ error: 'Discogs API error', details: error.message });
	  }
}

exports.searchVersions = async function(req, res) {
	try {
		const data = await getDiscogsData(`https://api.discogs.com/masters/${req.params.albumId}/versions`, { format: 'Vinyl' });
		res.json(data);
	  } catch (error) {
		console.error('Discogs API error:', error.message);
		res.status(500).json({ error: 'Discogs API error', details: error.message });
	  }
}

exports.searchArtist = async function(req, res) {
	try {
		const data = await getDiscogsData(`https://api.discogs.com/artists/${req.params.artistId}/releases`);
		const releases = data.releases || [];
		let ids = []
		let images = []
		for (let i = 0; i < releases.length; i++) {
			if ((releases[i].format && releases[i].format.includes('Vinyl')) || (releases[i].type && releases[i].type == 'master')) {
				if(ids.includes(releases[i].id) == false){
					ids.push(releases[i].id)
					images.push(releases[i].thumb)
					if(images.length >= 4) break;
				}
			}
		}
		res.json({images: images, ids: ids});
	  } catch (error) {
		console.error('Discogs API error:', error.message);
		res.status(500).json({ error: 'Discogs API error', details: error.message });
	  }
}