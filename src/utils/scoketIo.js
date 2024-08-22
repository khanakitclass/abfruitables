const { Server } = require("socket.io");

const connectChat = () => {
    const io = new Server({
        cors: {
            origin: process.env.SCOKETIO_URL,
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.emit('welcome', 'welcome fruitable web');
        socket.broadcast.emit('greeting', 'welcome all');

        socket.on('message', (data) => {
            console.log(data);

          
            socket.to(data.receiver).emit('res-msg', data.message);
        });

        socket.on('group-message',(data)=>{
            console.log(data);
            socket.join(data);
        })
    });

    io.listen(8081, () => {
        console.log("Server is running on http://localhost:8081");
    });
}

module.exports = connectChat;
