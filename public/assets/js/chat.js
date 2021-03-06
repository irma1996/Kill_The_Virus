const socket = io();

const startEl = document.querySelector('#start');
const usernameForm = document.querySelector('#username-form');
const gameWrapper = document.querySelector('#game-wrapper');
const img = document.querySelector('#corona');
const room = document.querySelector('#waitingForTheGambler');
const gameOverResult = document.querySelector('#gameOver');
const restartOver = document.querySelector('#restartOver') 

  
let username = null;
let reactiontime = null;
let timer = null;

let infoAboutGamblers = {
    id: null,
    reactiontime
};

let pointBoard = {}; 

// Update online users
const updateOnlineUsers = (users) => {
	document.querySelector('#online-users').innerHTML = users.map(user => 
		`<li class="user">Player: ${user}</li>`).join("");
}


// Update point board 
const updatePointBoard = (pointBoard) => {
	document.querySelector('#pointResult')
	.innerHTML = Object.entries(pointBoard).map(([key, value]) => {
        console.log(`${key}: ${value}`)
        return `<li class="list-item users">${key}: ${value}</li>`
    }).join('');
};


const firstPage = () => {
    room.classList.add('hide');
    gameWrapper.classList.remove('hide');
}

const gameOverPage = (pointBoard) => {  
	document.querySelector('#Result')
	.innerHTML = Object.entries(pointBoard).map(([key, value]) => {
        console.log(`${key}: ${value}`)
        return `<li class="list-item users"> ${key}: ${value} </li>`
    }).join('');
	
	gameOverResult.classList.remove('hide');
    gameWrapper.classList.add('hide');
}

// Random position image
const SomeRandomPosition = (target) => {
    img.style.top = target.width + "px";
	img.style.left = target.height + "px";
	
};
 
img.addEventListener('click', e => {

	let clickedTime = Date.now();
	reactiontime = clickedTime-timer;
	
	let infoAboutGamblers = {
        id: socket.id,
        reactiontime,
    }
	socket.emit('user-click', infoAboutGamblers);
});


const imgRandom = (touchDelay) => {
	
	setTimeout(() => {
		SomeRandomPosition(touchDelay.touch)
		timer = Date.now();
	}, touchDelay.delay);
	
}

//Restart the game
restartOver.addEventListener('click', (e) => { 
	e.preventDefault();

	gameOverResult.classList.add('hide');
    startEl.classList.remove('hide');
})

// Register new user from startpage
usernameForm.addEventListener('submit', e => {
	e.preventDefault();

username = document.querySelector('#username').value;
socket.emit('register-user', username, (status) => {
 
		if (status.joinChat) {
			startEl.classList.add('hide');
			room.classList.remove('hide');

			updateOnlineUsers(status.onlineUsers);
		}
	});

});


//Sockets for user registration and diconnection
socket.on('reconnect', () => {
	if (username) {
		socket.emit('register-user', username, () => {
			
		});
	}
});

socket.on('online-users', (users) => {
	updateOnlineUsers(users);
});

socket.on('user-click', (touchDelay) => {
    imgRandom(touchDelay)
});

socket.on('create-game-page', firstPage);

socket.on('game-over', gameOverPage); 

socket.on('update-score', updatePointBoard);

