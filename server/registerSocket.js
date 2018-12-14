const socketIo = require('socket.io');

function registerSocket(app) {
  const io = socketIo(app.server);

  app.post('/triggerSocket', (req, res) => {
    console.log('post!!');
    io.emit('invalid-cache');
    res.sendStatus(200);
  });
}

module.exports = registerSocket;
