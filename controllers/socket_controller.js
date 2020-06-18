
// Socket Controller
 
const debug = require('debug')('09-simple-chat:socket_controller');
let users = {};

let io = null;
let someOtherGamblers = {};

let imgClicked = 0;  
let game = {
    gamblers: {},
    gamedRounds: 0,
	score: {},
	reaction: {}
};

let pointBoard = {}; 

// Get usernames of online users
function getOnlineUsers() {
	return Object.values(users);
}

// Start a new game
function NewGame(socket,id) {
    pointBoard[game.gamblers[id]] = game.score[id];
    console.log('creating game from gamblers: ', users[socket.id]);
        
    if (game.gamedRounds < 10) {
        console.log('Game rounds: ', game.gamedRounds)
    } else {
        io.emit('game-over', pointBoard);
        game.gamedRounds = 0;
        reset();
        console.log("game over");
        return;
    }
 
};

// Updating pointBoard
function updatePointBoard(id) {
    pointBoard[game.gamblers[id]] = game.score[id];
    console.log('updating result', pointBoard);

    io.emit('update-score', pointBoard);
}


//function for getting a random number 
const SomeRandomPosition = (range) => {
	return Math.floor(Math.random() * range)
};
	   
		function user(username){
		  console.log(username, "clicked")
	   
		  const touch = {
			width: SomeRandomPosition(390),
			height: SomeRandomPosition(670)
		  }

		  const delay = SomeRandomPosition(900)
		  
		  const touchDelay = {
            touch,
            delay,
        };
 
		  // Emit new image
		  io.emit('user-click', touchDelay);
	   	
};


// Get time when the  gambler clicked at the virus 
function ClickTheTime(info) {
    game.reaction[info.id] = info.reactiontime;
	RTcompare(this); 
	imgClicked++;
};


function RTcompare(socket) {
    if (imgClicked) {
        if (game.reaction[socket.id] < someOtherGamblers.reaction) {
            game.score[socket.id]++;
            updatePointBoard(socket.id); 
        } else if (game.reaction[socket.id] > someOtherGamblers.reaction) {
            game.score[someOtherGamblers.id]++;
            updatePointBoard(someOtherGamblers.id); 
        }
    } else { 
        someOtherGamblers = {
            id: [socket.id], 
            reaction: game.reaction[socket.id]
        }
        return;
    }
    debug('Score: ', game.score);
    imgClicked = 0;
    game.gamedRounds++;

    NewGame(socket);
};


//Waiting for 2 gamblers to conect 
function checkUsersOnline(socket) {
    if (Object.keys(users).length === 2) {
        game.score[socket.id] = 0;
		pointBoard[game.gamblers[socket.id]] = 0; 

		io.emit('update-score', pointBoard); 
        io.emit('create-game-page');
        
        console.log(users[socket.id] + ' started the game');
        console.log('gamblers of the game: ', game.gamblers);
 
        NewGame(socket);
    } else { 
		game.score[socket.id] = 0;
        pointBoard[game.gamblers[socket.id]] = 0;
        return;
    }
}


// Handle a new user connecting
function handleRegisterUser(username, callback) {
	debug("User '%s' connected to the chat", username);
	
	users[this.id] = username;
	game.gamblers[this.id]=username; 
	
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

//saved info about gamblers
const reset = () => {
    users = {};
    game = {
        gamblers: {},
        gamedRounds: 0,
        score: {},
        reaction: {} 
    }

    pointBoard = {}; 

}

// Handle user disconnecting
function handleUserDisconnect() {
	debug(`Socket ${this.id} left the chat :(`);
    if (game.gamblers[this.id]) {
	// broadcast to all connected sockets that this user has left the chat
	if (users[this.id]) {
		this.broadcast.emit('user-disconnected', users[this.id]);
	}
    reset();
    }
	// remove user from list of connected users
	delete users[this.id];
}

module.exports = function(socket) {
	debug(`Client ${socket.id} connected!`);
	io = this;

	socket.on('user-click', user);
	socket.on('user-click', ClickTheTime);
	socket.on('disconnect', handleUserDisconnect);
	socket.on('new-user-connected', (username) => {
        debug(username + ' connected to game')
    });
	socket.on('register-user', handleRegisterUser);


}
