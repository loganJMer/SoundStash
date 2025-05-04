async function favAlbum(){
	let url = location.href
    url = url.slice(url.indexOf('0') + 3)
    url = decodeURIComponent(url)
	let response = await fetch('/favSong', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({song: url})
    })
    let data = await response.json()
    let success = data.success
    console.log(success)
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('favouriteSong').addEventListener('click', favAlbum)
})