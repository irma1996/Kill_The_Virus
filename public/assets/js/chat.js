const socket = io();

const startEl = document.querySelector('#start');
const usernameForm = document.querySelector('#username-form');
const gameWrapper = document.querySelector('#game-wrapper');
const img = document.querySelector('#corona');
const room = document.querySelector('#waitingForTheGambler');
    
let username = null;

const updateOnlineUsers = (users) => {
	document.querySelector('#online-users').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("");
}

const firstPage = () => {
    room.classList.add('hide');
    gameWrapper.classList.remove('hide');
}

const SomeRandomPosition = (target) => {
    img.style.top = target.width + "px";
    img.style.left = target.height + "px";
}
 
img.addEventListener('click', e => {
    socket.emit('user-click', username)
    console.log('Hello', username);
});


// get username from form and emit `register-user`-event to server
usernameForm.addEventListener('submit', e => {
	e.preventDefault();

username = document.querySelector('#username').value;
socket.emit('register-user', username, (status) => {
	console.log("Server acknowledged the registration :D", status);
 
		if (status.joinChat) {
			startEl.classList.add('hide');
			room.classList.remove('hide');

			updateOnlineUsers(status.onlineUsers);
		}
	});

});

socket.on('reconnect', () => {
	if (username) {
		socket.emit('register-user', username, () => {
			console.log("The server acknowledged our reconnect.");
		});
	}
});

socket.on('online-users', (users) => {
	updateOnlineUsers(users);
});

socket.on('user-click', (target) => {
    SomeRandomPosition(target)
});

socket.on('create-game-page', firstPage);

