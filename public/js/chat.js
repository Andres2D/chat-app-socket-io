
//HTMLRefs
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const UlMessages = document.querySelector('#UlMessages');
const btnLogout = document.querySelector('#btnLogout');

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
    document.title = user.name;

    await connectSocket();

}

const connectSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });
    
    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('receive-messages', () => {

    });

    socket.on('active-users', renderUser);

    socket.on('private-message', () => {

    });

}

const renderUser = (users = []) => {

    let usersHTML = '';
    users.forEach(({name, uid}) => {
        usersHTML += `
        <li>
            <p>
                <h5 class="text-success">${name}</h5>
                <span class="fs-6 text-muted">${uid}</span>
                </p>
        </li>
        `
    });
    ulUsers.innerHTML = usersHTML;
}

const main = async() => {

    // Validate JWT
    await validateJWT();

}

main();


