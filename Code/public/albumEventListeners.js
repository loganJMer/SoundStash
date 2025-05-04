function search(){
	let albumName = document.getElementById('album').value
	let albumSearch = encodeURIComponent(albumName)
	location.assign("http://localhost:3000/albums/" + albumSearch)
}
function handleKeyUp(e) {
  
    if (e.which == 13) {
      search()
    }
  
    e.stopPropagation()
    e.preventDefault()
  
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit').addEventListener('click', search)
    document.addEventListener('keyup', handleKeyUp)
})

