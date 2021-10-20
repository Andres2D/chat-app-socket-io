function handleCredentialResponse(response) {
    //Google token: ID_TOKEN
   const body = {
       id_token: response.credential
    };

   fetch('http://localhost:8080/api/auth/google', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(body)
   })
        .then( r => r.json())
        .then(({user, token}) => {
            localStorage.setItem('email', user.email);
            localStorage.setItem('token', token);
            console.log(token);
        })
        .catch(console.warn);
}

const button = document.getElementById('google_signout');
button.onclick = () => {
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    })
}
