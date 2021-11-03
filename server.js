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

let connected = [];

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    connected.push({
        sockId: socket.id,
        name: "["+socket.id+"]",
        color: "000000"
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        let data = {
            name: "Unknown",
            message: "left the party",
            color: "000000"
        }
        
        let logedOut = connected.filter(c => c.sockId == socket.id);
        if (logedOut) {
            data.name = logedOut[0].name;
        }

        connected = connected.filter(c => c.sockId != socket.id);
        io.emit('members updated', connected);
        io.emit('chat message', data);
        console.log(connected);
    });
    socket.on('chat message', (msg) => {
        console.log(msg, socket.id);
        io.emit('chat message', {...msg, socketId: socket.id });
    });
    socket.on('join the party', (data) => {
        console.log("Join the party", data, socket.id);
        connected
            .filter(c => c.sockId == socket.id)
            .map(c => {
                c.name = data.name;
                c.color = data.color
            });
        io.emit('members updated', connected)
        io.emit('chat message', {
            message: "Joined the party",
            name: data.name,
            color: data.color
        });
        console.log("Connected", connected);
    })
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});