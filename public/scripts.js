var name = "";
while(!name || name === "" || name == "null") {
    name = prompt("Please enter your name", "Harry Potter");
}

var color = getColorFromName(name);
var socket = io("http://localhost:3000");
var form = document.getElementById('form');
var input = document.getElementById('input');
var lastMsg = "Demo text just here to test the functionality without having to type to much.";
input.onkeydown = checkKey;
input.focus();
document.getElementById('name').innerText = name

socket.emit('join the party', name);
socket.emit('chat message', {
    message: "Joined the party",
    name: name,
    color: color
});

socket.on('members updated', function(msg) {
    connected.innerText = "";
    msg.forEach(element => {
        console.log(element)
        var item = document.createElement('li');
        item.textContent = element.name;
        connected.appendChild(item);
    });
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', {
            message: input.value,
            name: name,
            color: color
        });
        lastMsg = input.value;
        input.value = '';
    }
});

socket.on('chat message', function (data) {
        console.log(data)
        var item = document.createElement('li');
        item.textContent = "<"+data.name +"> " + data.message;
        item.style="color: #"+data.color;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

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

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        input.value = lastMsg;
        console.log("up")
    }
}