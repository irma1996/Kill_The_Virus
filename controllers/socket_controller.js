
// Socket Controller
 
const debug = require('debug')('09-simple-chat:socket_controller');
const users = {};

let game = {
    gamblers: {},
    gamedRounds: 0,
	reaction: {},  
	score: {}
}

// Start a new game
function NewGame(socket) {
    console.log('creating game from gamblers: ', users[socket.id]);
        
    if (game.gamedRounds < 10) {
        socket.emit('get-available-space', socket.id);
        console.log('Game rounds: ', game.gamedRounds)
    } else {
        io.emit('game-over', game.gamblers, game.score);
        game.gamedRounds = 0;
    
        console.log("game over");
        return;
    }
 
};

//Waiting for 2 player to conect 
function checkUsersOnline(socket) {
    if (Object.keys(users).length === 2) {
        game.score[socket.id] = 0;
 
        io.emit('create-game-page');
        
        console.log(users[socket.id] + ' started the game');
        console.log('gamblers of the game: ', game.gamblers);
 
        NewGame(socket);
    } else {
        return;
    }
}

// Get usernames of online users
function getOnlineUsers() {
	return Object.values(users);
}

// Handle user disconnecting
function handleUserDisconnect() {
	debug(`Socket ${this.id} left the chat :(`);

	// broadcast to all connected sockets that this user has left the chat
	if (users[this.id]) {
		this.broadcast.emit('user-disconnected', users[this.id]);
	}

	// remove user from list of connected users
	delete users[this.id];
}
 

//function for getting a random number 
const SomeRandomPosition = (range) => {
	return Math.floor(Math.random() * range)
};
	   
		function user(username){
		  console.log(username, "clicked")
	   
		  const touch = {
			width: SomeRandomPosition(390),
			height: SomeRandomPosition(690)
		  }

		  const delay = SomeRandomPosition(900)
		  
		  const touchDelay = {
            touch,
            delay,
        };
 
	   
		  // Emit new image
		  io.emit('user-click', touchDelay);
	   	
};


// Handle a new user connecting
function handleRegisterUser(username, callback) {
	debug("User '%s' connected to the chat", username);
	users[this.id] = username;
	callback({
		joinChat: true,
		usernameInUse: false,
		onlineUsers: getOnlineUsers(),
	});

	checkUsersOnline(this);

	// broadcast to all connected sockets EXCEPT ourselves
	this.broadcast.emit('new-user-connected', username);

	// broadcast online users to all connected sockets EXCEPT ourselves
	this.broadcast.emit('online-users', getOnlineUsers());
}


module.exports = function(socket) {
	debug(`Client ${socket.id} connected!`);
	io = this;
	socket.on('user-click', user);
	socket.on('disconnect', handleUserDisconnect);

	socket.on('register-user', handleRegisterUser);

}
