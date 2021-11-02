const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);

const io = require("socket.io")(server, {  
    cors: {    
        origin: "*",    
        methods: ["GET", "POST"]  
    }
});

app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected:');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log(msg);
        io.emit('chat message', msg);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});