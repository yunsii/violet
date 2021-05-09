const http = require('http');
const WebSocketServer = require('websocket').server;
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const PORT = 8721;
const EXTENSION_DIRECTORY = path.resolve(__dirname, '../dist');
const EXTENSION_MANIFEST = path.resolve(__dirname, '../manifest.json');
const OUTPUT_EXTENSION_MANIFEST = path.resolve(__dirname, '../dist/manifest.json');

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

const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on('connect', (connection) => {
  console.log('start ws server at port', connection.socket.localPort);
})

wsServer.on('request', function (request) {
  const connection = request.accept(null, request.origin);
  connection.on('message', function (message) {
    console.log('Received Message:', message.utf8Data);
  });
  connection.on('close', function (reasonCode, description) {
    console.log('Client has disconnected.');
  });
  console.log('watch', EXTENSION_DIRECTORY);
  // 监听扩展打包后的文件夹 /dist，有变动时发出通知
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
  // 监听 manifest.json 的变化，有变化时自动同步到 /dist 下
  chokidar
    .watch(EXTENSION_MANIFEST, {
      ignoreInitial: true,
    })
    .on(
      'change',
      debounce((event, path) => {
        const message = `${event} ${path}`;
        console.log(message);
        fs.copyFileSync(EXTENSION_MANIFEST, OUTPUT_EXTENSION_MANIFEST);
      })
    );
});
