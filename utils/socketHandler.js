const socketHandler = (socket) => {
  console.log('A user connected');

  socket.on('annotate', (data) => {
    console.log(`Received annotation: ${data}`);
    socket.broadcast.emit('annotation', data);
  });

  socket.on('addComment', (data) => {
    console.log(`Received new comment: ${data}`);
    socket.broadcast.emit('newComment', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
};

module.exports = socketHandler;
