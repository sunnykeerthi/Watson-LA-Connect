var express = require('express');
var socket = require('socket.io');

const helperFunctions = require("./helperFunctions");
const envVariables = require("./config");
var pullmessageorg;
var sessionkey;
var affinity;
var sessionid;
var app = express();
var server = app.listen(4000, () => {
    console.log(`Listening to request on port`);
})

//Static Files
app.use(express.static('public'))



//Set up Socket.io
var io = socket(server);

io.on('connection', function (socket) {
    console.log(`Connection Established ${socket.id}`);


    socket.on('transfer', (data) => {
        console.log(`TeNSFER TO Agent`);
        main(data, socket);
    })

    /*socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    })*/
});


//LA Communication
async function main(data, socket) {
    console.log(`Entereed`)
    const getSessionId = await helperFunctions.sessionId();
    var currentData;
    if (getSessionId.success === true) {
        sessionkey = getSessionId.data.key;
        affinity = getSessionId.data.affinityToken;
        sessionid = getSessionId.data.id;

        const body = {
            organizationId: envVariables.CHAT_ORGANISATIONID,
            deploymentId: envVariables.CHAT_DEPLOYMENTID,
            buttonId: envVariables.CHAT_BUTTONID,
            sessionId: sessionid,
            userAgent: "Lynx/2.8.8",
            language: "en-US",
            screenResolution: "1900x1080",
            visitorName: "Console Test User",
            prechatDetails: [],
            prechatEntities: [],
            receiveQueueUpdates: true,
            isPost: true,
        };

        const sendingChatRequest = await helperFunctions.sendingChatRequest(
            body,
            affinity,
            sessionkey
        );

        if (sendingChatRequest === true) {
            console.log(
                "\n Chat Session Initiated Successfully."
            );

            pullmessageorg = await helperFunctions.pullingMessages(
                affinity,
                sessionkey
            );

            while (pullmessageorg.messages[0].type != "ChatEnded") {
                if (pullmessageorg.messages[0].type === "ChatRequestSuccess") {
                    io.sockets.emit('chat', ' Waiting for agent to accept your request.');
                    console.log(

                        "\n Waiting for agent to accept your request."
                    );
                }
                if (pullmessageorg.messages[0].type === "ChatEstablished") {
                    io.sockets.emit('chat', 'Agent Accepted');

                    console.log("\n Agent Accepted your request.");
                    io.sockets.emit('chat', ` \n ${pullmessageorg.messages[0].message.name} is here to help you. Should be joining you any second now. If you wish to stop the chat at any time, please send the following message: end_chat\n `);

                    console.log(
                        "\n" +
                        pullmessageorg.messages[0].message.name +

                        " is here to help you. Should be joining you any second now. If you wish to stop the chat at any time, please send the following message: " + "end_chat\n"
                    );

                }

                if (pullmessageorg.messages[0].type === "ChatMessage") {
                    //socket.on('chat', (data) => {
                    io.sockets.emit('chat', pullmessageorg.messages[0].message.text);
                    //})
                    console.log(
                        "\n" + pullmessageorg.messages[0].message.name +
                        " : " +
                        pullmessageorg.messages[0].message.text +
                        "\n"
                    );
                    socket.on('chat', (data) => {
                        console.log('data');
                        console.log(data);
                        console.log('data');
                        currentData = data;
                        io.sockets.emit('chat', data.message);

                    })

                    let text = currentData.message;

                    if (text === "end_chat") {
                        const stopChat = await helperFunctions.stopChat(
                            "client ended chat",
                            affinity,
                            sessionkey
                        );

                        if (stopChat === "OK") {
                            console.log("\n Chat Ended. You Left. \n");
                            return;
                        } else {
                            console.log("\n Error: Cannot Stop Chat \n");
                            return;
                        }
                    }

                    const sendMessage = await helperFunctions.sendMessages(
                        text,
                        affinity,
                        sessionkey
                    );

                    if (sendMessage !== "OK") {
                        console.log("\n Error: Cannot Send Message \n");
                        return;
                    }
                }
                const pullingMessagesAgain = await helperFunctions.pullingMessages(
                    affinity,
                    sessionkey
                );
                pullmessageorg = pullingMessagesAgain;
            }

            console.log("\n Chat Ended. Agent Left The Chat. \n");
            return;
        } else {
            console.log("\n Error: Sending Chat Request Failed \n");
            return;
        }
    } else {
        console.log("\n Error: Cannot Get Session Id \n");
        return;
    }
}