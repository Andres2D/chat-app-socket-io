
let user = null;
let socket = null;
const url = 'http://localhost:8080/api/auth';

const validateJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('Invalid token');
    }

    const resp = await fetch(url, {
        headers: {'x-token': token}
    });

    const {user: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    console.log(userDB, tokenDB);
}

const main = async() => {

    // Validate JWT
    await validateJWT();

}

main();

// const socket = io();
