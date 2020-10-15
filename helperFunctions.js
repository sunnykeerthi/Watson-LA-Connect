const axios = require("axios");
const apiEndpoints = require("./endpoints");
const SERVER_URL = process.env.SERVER_URL || 'https://d.la2-c2-ukb.salesforceliveagent.com/chat/rest/';
const GET_SESSION_ID = `${SERVER_URL}System/SessionId`;
const CHECK_AVAILABILITY = `${SERVER_URL}System/SessionId`;
const CHAT_REQUEST = `${SERVER_URL}System/SessionId`;
const PULLING_MESSAGES = `${SERVER_URL}System/SessionId`;
const SENDING_MESSAGES = `${SERVER_URL}System/SessionId`;


const agentAvailability = async () =>
  await axios
  .get(SERVER_URL + 'Visitor/Availability', {
    headers: {
      "X-LIVEAGENT-API-VERSION": 49,
    },
    params: {
      'Availability.ids': '5732w000000HUCD',
      'Availability.ids': '5722w000000HSZd',
      'org_id': '00D2w00000CpQUW',
      'Availability.needEstimatedWaitTime': 0
    }
  })
  .then((res) => res.data)
  .then((res) => {
    if (res.messages[0].message.results[0].isAvailable)
      return {
        success: true,
        data: res,
      };
    else
      return {
        success: false,
      };
  })
  .catch(() => {
    console.log('Established Session err');
    return {
      success: false,
    };
  });



const sessionId = async () =>
  await axios
  .get(apiEndpoints.sessionid, {
    headers: {
      "X-LIVEAGENT-API-VERSION": 49,
      "X-LIVEAGENT-AFFINITY": "null",
    },
  })
  .then((res) => res.data)
  .then((res) => {
    console.log('Established Session');
    return {
      success: true,
      data: res,
    };
  })
  .catch(() => {
    return {
      success: false,
    };
  });

const sendingChatRequest = async (body, affinity, sessionkey) =>
  await axios
  .post(apiEndpoints.chatrequest, body, {
    headers: {
      "X-LIVEAGENT-API-VERSION": 49,
      "X-LIVEAGENT-AFFINITY": affinity,
      "X-LIVEAGENT-SESSION-KEY": sessionkey,
      "X-LIVEAGENT-SEQUENCE": 1,
    },
  })
  .then((res) => res.data)
  .then(() => {
    return true;
  })
  .catch((err) => {
    console.log(err);
  });

const pullingMessages = async (affinity, sessionkey) =>
  await axios
  .get(apiEndpoints.pullingmessages, {
    headers: {
      "X-LIVEAGENT-API-VERSION": 49,
      "X-LIVEAGENT-AFFINITY": affinity,
      "X-LIVEAGENT-SESSION-KEY": sessionkey,
    },
  })
  .then((res) => res.data)
  .then((res) => {
    //console.log(res);
    return res;
  })
  .catch((err) => {
    console.log(err);
  });

const sendMessages = async (text, affinity, sessionkey) =>
  await axios
  .post(
    apiEndpoints.sendingmessages, {
      text: text,
    }, {
      headers: {
        "X-LIVEAGENT-API-VERSION": 49,
        "X-LIVEAGENT-AFFINITY": affinity,
        "X-LIVEAGENT-SESSION-KEY": sessionkey,
      },
    }
  )
  .then((res) => res.data)
  .then((res) => {
    // console.log(res);
    return res;
  })
  .catch((err) => {
    console.log(err);
  });

const stopChat = async (reason, affinity, sessionkey) =>
  await axios
  .post(
    apiEndpoints.stopchat, {
      "reason": reason
    }, {
      headers: {
        "X-LIVEAGENT-API-VERSION": 49,
        "X-LIVEAGENT-AFFINITY": affinity,
        "X-LIVEAGENT-SESSION-KEY": sessionkey,
      },
    }
  )
  .then((res) => res.data)
  .then((res) => {
    // console.log(res);
    return res;
  })
  .catch((err) => {
    console.log(err);
  });

module.exports.sessionId = sessionId;
module.exports.sendingChatRequest = sendingChatRequest;
module.exports.pullingMessages = pullingMessages;
module.exports.sendMessages = sendMessages;
module.exports.stopChat = stopChat;
module.exports.agentAvailability = agentAvailability;