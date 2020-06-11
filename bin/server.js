
// Module dependencies.

require('dotenv').config();

const app = require('../app');
const debug = require('debug')('09-simple-chat:server');
const http = require('http');
const SocketIO = require('socket.io');

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
 const server = http.createServer(app);
const io = SocketIO(server);

io.on('connection', require('../controllers/socket_controller'));


// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


const SomeRandomPosition = (range) => {
  return Math.floor(Math.random() * range)
};
 
io.on("connection", (socket) => {
 
  socket.on('user-click', (username) => {
    console.log(username, "clicked")
 
    const click = {
      width: SomeRandomPosition(400),
      height: SomeRandomPosition(400)
    }
 
    // Emit new image
    io.emit('user-click', click);
 
  });
});

//Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "error" event.
 function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
