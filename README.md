# Watson-LA-Connect
- This is a simple Javascript app built using Salesforce Chat REST API that helps you communicate between IBM Watson and Live Agent.
- Heroku acts as the orchestrator.

# Prerequisits:

- Saleforce Developer Account with Live Agent(Chat) Setup.
- Heroku Account.
- IBM Watson Account

Installation:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/sunnykeerthi/Watson-LA-Connect/tree/main)

Instructions:

Once done the deployment. Click Manage App and select Settings tab.

Scroll down to Config Vars Section Click Reveal Config Vars and crate config vars as below.

| CHAT BUTTONID | LA Chat Button Id |
| CHAT DEPLOYMENTID | LA Chat Deployment Id (Not embeddded service deployment key) |
| CHAT ORGANISATIONID | Org Id |
| SERVER URL | Chat URL |
| WATSON ASSISTANT ID | IBM Watson Assistant Id |
| WATSON ASSISTANT KEY | IBM Watson Assistant Key |
| WATSON ASSISTANT URL | IBM Watson Assistant URL |


# Where do I get these Details
**Salesforce**
- Chat Button Id - Set up -> Search Chat Buttons & Invitations -> Click your Chat button and grab the Id.
- Chat Deployment Id - Set up -> Search Deployments -> Select Deployments under Chat -> Click your Deployment and grab the Id.
- Chat Organisation Id - Set up -> Search Company Information -> And you get the *Chat API Endpoint*
- Server URL - Set up -> Search Chat setting. And you get the *Chat API Endpoint*

**IBM Watson** 
- Navigate to your Watson Assistant Skills page -> Click 3 dots on top right of your assistant-> Select View API Details.
From the pop up 

![alt text](<https://i.imgur.com/dixw4GV.png>)


| Skill ID | IBM Watson Assistant Id |
| API key | IBM Watson Assistant Key |
| Legacy v1 workspace URL | IBM Watson Assistant URL (Note: consider the URL before _/v1/(Excluding)_) | 

![alt text](<https://i.imgur.com/1iFRiqT.png>)


