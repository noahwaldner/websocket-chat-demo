const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https');
const privateKey  = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const server = https.createServer(credentials, app);

/*
const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const led = new Gpio(12, 'out'); //use GPIO pin 4, and specify that it is output
led.writeSync(0);
*/
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

    var address = socket.handshake.address;

    connected.push({
        socketId: socket.id,
        name: "["+address.address+"]",
        color: "000000"
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        let data = {
            name: "Unknown",
            message: " ist nicht mehr dabei",
            color: "000000",
            socketId: socket.id
        }
        
        let logedOut = connected.filter(c => c.socketId == socket.id);
        if (logedOut) {
            data.name = logedOut[0].name;
            data.color = logedOut[0].color;
            data.message = logedOut[0].name + " " + data.message;
        }

        connected = connected.filter(c => c.socketId != socket.id);
        io.emit('members updated', connected);
        io.emit('join message', data);
        console.log(connected);
    });
    socket.on('chat message', (msg) => {
        console.log(msg, socket.id);
        io.emit('chat message', {...msg, socketId: socket.id });

        /*
        let blkCounter = 20;
        const iv = setInterval(_ => {
            led.writeSync(led.readSync() ^ 1);
            blkCounter--;
            if (blkCounter <= 0) {
                clearInterval(iv);
            }
        }, 25);
        */
    });
    socket.on('join the party', (data) => {
        console.log("Join the party", data, socket.id);
        connected
            .filter(c => c.socketId == socket.id)
            .map(c => {
                c.name = data.name;
                c.color = data.color
            });
        io.emit('members updated', connected)
        io.emit('join message', {
            message: data.name + " ist jetzt im Club",
            name: data.name,
            color: data.color,
            socketId: socket.id
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