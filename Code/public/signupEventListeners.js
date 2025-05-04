async function signup(){
    let userID = document.getElementById('username').value
    let password = document.getElementById('password').value
    let response = await fetch('/checkUserExists', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID: userID})
    })
    let data = await response.json()
    let userExists = data.userExists
	if(userExists){
        console.log("Username taken. Redirecting with context")
        location.assign('http://localhost:3000/signup?context=userTaken')
    } else{
        console.log("Username not taken. Creating user")
        let response = await fetch('/addUser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userID: userID, password: password})
        })
        let data = await response.json()
        let success = data.success
        if(success){
            console.log("User successfully created!")
            location.assign('http://localhost:3000/signup?context=userCreated')
        }
    }
} 

async function signin(){

    let response = await fetch('/signin', {method: 'POST'});
    let data = await response.json();
    if(data.auth) {
        location.assign('http://localhost:3000/albums')
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signup').addEventListener('click', signup)
    document.getElementById('signin').addEventListener('click', signin)
})

