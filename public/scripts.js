//Get users name
let name = "Blubber";

///////////////////////////////////////////////////////////////////////////////////////////////
// Platzhalter: " Name Abfragen"
///////////////////////////////////////////////////////////////////////////////////////////////

// Defined variables and initialize needed libraries
let notifs = false;
let color = getColorFromName(name);
const socket = io("https://172.21.1.32:3000");
const form = document.getElementById('form');
const input = document.getElementById('input');
let lastMsg = "Demo text just here to test the functionality without having to type to much.";

//attach events and setup UI
input.focus();
document.getElementById('name').innerText = name

// Inform the server that we are ready and pass the username
socket.emit('join the party', {
    name: name,
    color: color
});

///////////////////////////////////////////////////////////////////////////////////////////////
// Platzhalter "Reagieren wenn jemand dazu kommt"
///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// Platzhalter: "Message abschicken"
///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// Platzhalter: "Reagieren wenn jemand dazu kommt"
///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// Platzhalter: "Notifications einschalten"
///////////////////////////////////////////////////////////////////////////////////////////////

// Get color from Name
function getColorFromName(str){
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var c = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

// React on incoming messages
socket.on('chat message', incoming);
socket.on('join message', incoming);

function incoming(data) {
    console.log(data)
    var item = document.createElement('li');
    
    var span = document.createElement('span');
    span.textContent = "<"+data.name +">";
    span.style="font-weight: bold; padding-right: 0.5rem; color: #"+data.color;
    item.appendChild(span);
    
    var msg = document.createElement('span');
    msg.textContent = data.message;
    msg.style="color: #"+data.color;
    item.appendChild(msg);
    
    var dt = document.createElement('span');
    const now = new Date();
    dt.textContent = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    dt.style="float: right; color: #"+data.color;
    item.appendChild(dt);
    

    messages.appendChild(item);
    item.scrollIntoView(false);
    if (notifs) {
        nonPersistentNotification(name + ": " + item.textContent);
    }
}
