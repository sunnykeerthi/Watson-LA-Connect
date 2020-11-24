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

| CHAT\_BUTTONID | LA Chat Button Id |
| CHAT\_DEPLOYMENTID | LA Chat Deployment Id (Not embeddded service deployment key) |
| CHAT\_ORGANISATIONID | Org Id |
| SERVER\_URL | Chat URL |
| WATSON\_ASSISTANT\_ID | IBM Watson Assistant Id |
| WATSON\_ASSISTANT\_KEY | IBM Watson Assistant Key |
| WATSON\_ASSISTANT\_URL | IBM Watson Assistant URL |

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


| Skill\_ID | IBM Watson Assistant Id |
| API\_key | IBM Watson Assistant Key |
| Legacy\_v1\_workspace\_URL | IBM Watson Assistant URL (Note: consider the URL before _/v1/(Excluding)_) | 

![alt text](<https://i.imgur.com/1iFRiqT.png>)


