const http = require('http');
const WebSocketServer = require('websocket').server;
const chokidar = require('chokidar');
const path = require('path');

const PORT = 8721;
const EXTENSION_DIRECTORY = path.resolve(__dirname, '../dist');

const server = http.createServer();
server.listen(PORT);

function debounce(func, timeout = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

console.log('start ws server at port', PORT);
const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on('request', function (request) {
  const connection = request.accept(null, request.origin);
  connection.on('message', function (message) {
    console.log('Received Message:', message.utf8Data);
  });
  connection.on('close', function (reasonCode, description) {
    console.log('Client has disconnected.');
  });
  console.log('watch', EXTENSION_DIRECTORY);
  chokidar
    .watch(EXTENSION_DIRECTORY, {
      ignoreInitial: true,
    })
    .on(
      'all',
      debounce((event, path) => {
        const message = `${event} ${path}`;
        console.log(message);
        connection.sendUTF(message);
      })
    );
});
