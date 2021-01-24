//Connect
var socket = io.connect("https://ibm-la-connect.herokuapp.com/");

//Query Dom
var message = document.getElementById("message"),
    //handle = document.getElementById("handle"),
    btn = document.getElementById("send"),
    output = document.getElementById("output"),
    feedback = document.getElementById("feedback"),
    popup = document.querySelector(".chat-popup"),
    chatbtn = document.querySelector(".chat-btn");

chatbtn.addEventListener('click', () => {
    popup.classList.toggle('show');
});

var sessionId;
var botConvo = false;
if (!localStorage.session) {
    socket.emit("initMsg");
}

//Emit Events
message.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        btn.click();
    }
});


btn.addEventListener("click", () => {
    console.log(message);
    if (botConvo) {
        socket.emit('botRequestMessage', {
            message: message.value,
        });
    } else {
        socket.emit('U_chatData', {
            message: message.value,
        });
    }
    message.value = '';
});

//Listen for Events
socket.on("IBMSessId", data => {
    console.log('Receobd' + data);
    sessionId = data;
    botConvo = true;
});
socket.on("A_chat", data => {
    console.log(JSON.stringify(data));
    feedback.innerHTML = "";
    output.innerHTML += `<div class="transfer"><div class="chat-message">${data}</div></div>`;
    if (!data.includes('No Agents are Online.')) {
        console.log('non bot convo');
        botConvo = false;
    } else {
        console.log('bot conv');
    }

    scrollToBottom();
});
socket.on("A_chatText", data => {
    console.log(JSON.stringify(data));
    feedback.innerHTML = "";
    output.innerHTML += `<div class="chat agent"> <div class="user-photo"> </div><div class="chat-message">${data}</div></div>`;
    scrollToBottom();
});
socket.on("U_chat", data => {
    console.log(JSON.stringify(data));
    feedback.innerHTML = "";
    output.innerHTML += `<div class="chat userM"> <div class="user-photo"> </div><div class="chat-message">${data}</div></div>`;
    scrollToBottom();
});

socket.on("botResponse", data => {
    console.log(JSON.stringify(data));
    feedback.innerHTML = "";
    output.innerHTML += `<div class="chat bot"> <div class="user-photo"> </div><div class="chat-message">${data}</div></div>`;
    scrollToBottom();
});

socket.on("transferResponse", data => {
    console.log(JSON.stringify(data));
    feedback.innerHTML = "";
    output.innerHTML += `<div class="transfer"><div class="chat-message">${data}</div></div>`;

    socket.emit('transfer', {});
    scrollToBottom();
});

socket.on("agentAcc", data => {
    console.log(JSON.stringify(data));
    feedback.innerHTML = "";
    output.innerHTML += `<div class="transfer"><div class="chat-message">${data}</div></div>`;
    botConvo = false;
    scrollToBottom();
});

socket.on("A_chat_End", data => {
    console.log(JSON.stringify(data));
    feedback.innerHTML = "";
    output.innerHTML += `<div class="transfer"><div class="chat-message"> ${data}</div></div>`;
    botConvo = true;
    scrollToBottom();
});


socket.on("optns", data => {
    console.log(JSON.stringify(data) + 'bot resp in opts');
    var _data = data;

    feedback.innerHTML = "";
    //output.innerHTML += `<div class="chat bot"> <div class="user-photo"> </div><div class="chat-message">`;
    _data.forEach(item => {
        var btn = document.createElement("BUTTON");
        btn.className = 'TestClass';
        btn.innerHTML = item;
        btn.setAttribute('onclick', 'clicked(\'' + item + '\')')
        output.appendChild(btn);
    });
    //output.innerHTML += `</div></div>`;
    scrollToBottom();

});

function clicked(data) {
    console.log(data);
    socket.emit('botRequestMessage', {
        message: data
    });
}

function scrollToBottom() {
    let oDiv = document.getElementById('output');
    oDiv.lastElementChild.scrollIntoView({
        behavior: 'smooth'
    });
}