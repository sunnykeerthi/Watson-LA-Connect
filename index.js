var express = require('express');
var socket = require('socket.io');
var axios = require('axios');
const helperFunctions = require("./helperFunctions");
const envVariables = require("./config");
var assistantV2 = require('ibm-watson/assistant/v2');
require('dotenv').config();
var PORT = process.env.PORT || 4000;
var IBMSessionId;
//comment
var pullmessageorg;
var sessionkey;
var affinity;
var sessionid;
var app = express();
var server = app.listen(PORT, () => {
    console.log(`Listening to request on port ${PORT}`);
});
var conversation;
//Static Files
app.use(express.static('public'))
console.log('Received Init');
var {
    IamAuthenticator
} = require('ibm-watson/auth');
//authenticate
const authenticator = new IamAuthenticator({
    apikey: process.env.WATSON_ASSISTANT_KEY
})
//connect to assistant
const assistant = new assistantV2({
    version: '2020-09-13',
    authenticator: authenticator,
    url: process.env.WATSON_ASSISTANT_URL
})



//Set up Socket.io
var io = socket(server);

io.on('connection', function (socket) {
    console.log(`Connection Established ${socket.id}`);
    conversation = [];
    socket.on('initMsg', async () => {
        try {
            const sess = assistant.createSession({
                assistantId: process.env.WATSON_ASSISTANT_ID
            }).then(data => {
                IBMSessionId = data['result']['session_id'];
                console.log(`IBM Session Id is ${IBMSessionId}`);
                socket.emit('IBMSessId', IBMSessionId);
            })
                .catch(e => console.log(e));
        } catch (err) {
            console.log(err);
        }

    });

    socket.on('botRequestMessage', async (data) => {
        console.log(IBMSessionId + '****');
        conversation.push('User: ' + data.message + '\n');
        socket.emit('U_chat', data.message);
        payload = {
            assistantId: process.env.WATSON_ASSISTANT_ID,
            sessionId: IBMSessionId,
            input: {
                message_type: 'text',
                text: data.message
            }
        }
        const message = await assistant.message(payload);
        try {
            if (message.result.output.generic[0].response_type == 'text') {
                conversation.push('Bot: ' + message.result.output.generic[0].text + '\n');
                console.log(conversation);
                socket.emit('botResponse', message.result.output.generic[0].text);

            } else if (message.result.output.generic[0].response_type == 'option') {
                var opts = [];
                message.result.output.generic[0].options.forEach(item => opts.push(item.label));
                //conversation.push('Bot: ' + message.result.output.generic[0].text + '\n');
                conversation.push('Bot: ' + message.result.output.generic[0].title + '\n');
                console.log(conversation);
                //socket.emit('botResponse', message.result.output.generic[0].title);
                socket.emit('options', opts)
                console.log(JSON.stringify(opts));

            } else {
                socket.emit('transferResponse', 'Connecting you to Agent');
            }
        } catch (e) {
            console.log(e)
        }
    });


    socket.on('U_chatData', async (data) => {
        console.log('user: ' + data.message);
        socket.emit('U_chat', data.message);
        let text = data.message;
        const sendMessage = await helperFunctions.sendMessages(
            text,
            affinity,
            sessionkey
        );
        socket.emit('botResponse', message.result.output.generic[0].text);
        if (sendMessage !== "OK") {
            console.log("\n Error: Cannot Send Message \n");
            return;
        }
    })

    socket.on('transcript', async (data) => {
        console.log('user: ' + data.message);
        //socket.emit('U_chat', data.message);
        let text = data.message;
        const sendMessage = await helperFunctions.sendMessages(
            text,
            affinity,
            sessionkey
        );

        if (sendMessage !== "OK") {
            console.log("\n Error: Cannot Send Message \n");
            return;
        }
    })


    socket.on('transfer', async () => {
        console.log(`TeNSFER TO Agent`);
        console.log(`Entereed`)
        const getAgentAvailability = await helperFunctions.agentAvailability();
        console.log(getAgentAvailability);
        if (getAgentAvailability.success === true) {
            const getSessionId = await helperFunctions.sessionId();
            console.log(getSessionId);

            if (getSessionId.success === true) {
                sessionkey = getSessionId.data.key;
                affinity = getSessionId.data.affinityToken;
                sessionid = getSessionId.data.id;

                const body = {
                    organizationId: process.env.CHAT_ORGANISATIONID || envVariables.CHAT_ORGANISATIONID,
                    deploymentId: process.env.CHAT_DEPLOYMENTID || envVariables.CHAT_DEPLOYMENTID,
                    buttonId: process.env.CHAT_BUTTONID || envVariables.CHAT_BUTTONID,
                    sessionId: sessionid,
                    userAgent: "Lynx/2.8.8",
                    language: "en-US",
                    screenResolution: "1900x1080",
                    visitorName: "Ms. Jasmine Tay***",
                    prechatDetails: [{
                        "label": "LastName",
                        "value": "Tay***",
                        "entityMaps": [{
                            "entityName": "contact",
                            "fieldName": "LastName"
                        }],
                        "transcriptFields": [
                            "LastName__c"
                        ],
                        "displayToAgent": true
                    },
                    {
                        "label": "FirstName",
                        "value": "Jasmine",
                        "entityMaps": [{
                            "entityName": "contact",
                            "fieldName": "FirstName"
                        }],
                        "transcriptFields": [
                            "FirstName__c"
                        ],
                        "displayToAgent": true
                    },
                    {
                        "label": "Email",
                        "value": "lxysfdcdemo@gmail.com",
                        "entityMaps": [{
                            "entityName": "contact",
                            "fieldName": "Email"
                        }],
                        "transcriptFields": [
                            "Email__c"
                        ],
                        "displayToAgent": true
                    }
                    ],
                    prechatEntities: [{
                        "entityName": "Contact",
                        "saveToTranscript": "contact",
                        "linkToEntityField": "ContactId",
                        "entityFieldsMaps": [{
                            "fieldName": "LastName",
                            "label": "LastName",
                            "doFind": true,
                            "isExactMatch": true,
                            "doCreate": true
                        },
                        {
                            "fieldName": "FirstName",
                            "label": "FirstName",
                            "doFind": true,
                            "isExactMatch": true,
                            "doCreate": true
                        },
                        {
                            "fieldName": "Email",
                            "label": "Email",
                            "doFind": true,
                            "isExactMatch": true,
                            "doCreate": true
                        }
                        ]
                    }],
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
                    console.log('******');
                    console.log(JSON.stringify(pullmessageorg));
                    console.log('******');
                    while (pullmessageorg.messages[0].type != "ChatEnded") {

                        if (pullmessageorg.messages[0].type === "ChatRequestSuccess") {
                            io.sockets.emit('A_chat', ` Waiting for agent to accept your request.\n Your are in position ${getAgentAvailability.data.messages[0].message.results[0].estimatedWaitTime}`);
                            console.log(

                                "\n Waiting for agent to accept your request."
                            );
                        }
                        if (pullmessageorg.messages[0].type === "ChatEstablished") {
                            io.sockets.emit('A_chat', 'Agent Accepted');
                            console.log("\n Agent Accepted your request.");
                            io.sockets.emit('A_chat', `\n ${pullmessageorg.messages[0].message.name} is here to help you. Should be joining you any second now.`);
                            let text = '';
                            conversation.forEach(item => {
                                if (conversation.length == 1)
                                    text = item;
                                else
                                    text += item + '\n'
                            })

                            console.log('text');
                            console.log(text);
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

                        if (pullmessageorg.messages[0].type === "ChatMessage") {
                            console.log(
                                "\n" + pullmessageorg.messages[0].message.name +
                                " : " +
                                pullmessageorg.messages[0].message.text +
                                "\n"
                            );
                            io.sockets.emit('A_chatText',
                                "\n" + pullmessageorg.messages[0].message.name +
                                " : " +
                                pullmessageorg.messages[0].message.text +
                                "\n"
                            );

                        }

                        const pullingMessagesAgain = await helperFunctions.pullingMessages(
                            affinity,
                            sessionkey
                        );
                        pullmessageorg = pullingMessagesAgain;
                    }
                    io.sockets.emit('A_chat_End', ' Chat Ended. Agent Left The Chat.');
                    console.log("\n Chat Ended. Agent left the Chat. \n");
                    return;
                } else {
                    console.log("\n Error: Sending Chat Request Failed \n");
                    return;
                }
            } else {
                console.log("\n Error: Cannot Get Session Id \n");
                return;
            }
        } else {
            console.log("\n No Agents are Online. Please try back later \n");
            io.sockets.emit('A_chat', '\n No Agents are Online. Please try back later \n');

            // return;
        }
    })

});