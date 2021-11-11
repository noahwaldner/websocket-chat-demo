///////////////////////////////////////////////////////////////////////////////////////////////
// Name Abfragen
///////////////////////////////////////////////////////////////////////////////////////////////
while(!name || name === "" || name == "null") {
    name = prompt("Please enter your name", "Harry Potter");
}

///////////////////////////////////////////////////////////////////////////////////////////////
// Message abschicken
///////////////////////////////////////////////////////////////////////////////////////////////
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


///////////////////////////////////////////////////////////////////////////////////////////////
// Letzte Einabge wiederholen
///////////////////////////////////////////////////////////////////////////////////////////////
input.onkeydown = checkUpKey;
function checkUpKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        input.value = lastMsg;
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////
// Reagieren wenn jemand dazu kommt
///////////////////////////////////////////////////////////////////////////////////////////////
HTML:
<aside class="main-sidebar" role="complementary">
            <h3>Connected:</h3>
            <ul id="connected"></ul>
        </aside>

JAVASCRIPT:
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





///////////////////////////////////////////////////////////////////////////////////////////////
// Notifications einschalten
///////////////////////////////////////////////////////////////////////////////////////////////
if (notifs) {
    nonPersistentNotification(name + ": " + item.textContent);
}

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
