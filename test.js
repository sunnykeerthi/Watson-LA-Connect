const axios = require("axios");
const apiEndpoints = require("./endpoints");

const agentAvailability = async () =>
    await axios
    .get(apiEndpoints.sessionid, {
        headers: {
            "X-LIVEAGENT-API-VERSION": 49,
            "X-LIVEAGENT-AFFINITY": "null",
        },
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

agentAvailability();