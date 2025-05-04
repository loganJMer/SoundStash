async function favAlbum(){
	let url = location.href
    console.log(url)
    url = url.slice(url.indexOf('0') + 3)
	let response = await fetch('/favAlbum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({album: url})
    })
    let data = await response.json()
    let success = data.success
    console.log(success)
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('favouriteAlbum').addEventListener('click', favAlbum)
})