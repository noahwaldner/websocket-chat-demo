//Get users name
let name = "";
while(!name || name === "" || name == "null") {
    name = prompt("Please enter your name", "Harry Potter");
}
// Defined variables and initialize needed libraries
let notifs = false;
let color = getColorFromName(name);
const socket = io("https://172.21.1.32:3000");
const form = document.getElementById('form');
const input = document.getElementById('input');
let lastMsg = "Demo text just here to test the functionality without having to type to much.";

//attach events and setup UI
input.onkeydown = checkUpKey;
input.focus();
document.getElementById('name').innerText = name

// Inform the server that we are ready and pass the username
socket.emit('join the party', {
    name: name,
    color: color
});

// React on user list change
socket.on('members updated', function(data) {
    connected.innerText = "";
    console.log("Members update", data)
    data.forEach(u => {
        console.log(u)
        const item = document.createElement('li');
        item.textContent = u.name;
        item.style="color: #"+u.color;
        connected.appendChild(item);
    });
});

// React on form Submit
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {

        if (input.value === "enable notifications") {
            notifs = true;
            Notification.requestPermission(function (result) {
                alert("Notifications "+ result)
              });
        }

        else if (input.value === "dissable notifications") {
            notifs = false;
        }

        else {
            socket.emit('chat message', {
                message: input.value,
                name: name,
                color: color
            });
            lastMsg = input.value;
        }
        input.value = '';
    }
});

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

// Check if Up Key pressed
function checkUpKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        input.value = lastMsg;
    }
}

// Show notifications
function nonPersistentNotification(msg) {
    console.log("Try display notification");
    if (!('Notification' in window)) {
        alert('Notification API not supported!');
        return;
    }

    try {
        var notification = new Notification(msg);
    } catch (err) {
        alert('Notification API error: ' + err);
    }
}

function persistentNotification(msg) {
    if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
        alert('Persistent Notification API not supported!');
        return;
    }

    try {
        navigator.serviceWorker.getRegistration()
            .then((reg) => reg.showNotification(msg))
            .catch((err) => alert('Service Worker registration error: ' + err));
    } catch (err) {
        alert('Notification API error: ' + err);
    }
}