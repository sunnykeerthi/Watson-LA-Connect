const axios = require("axios");

var config = {
  method: 'get',
  url: 'https://d.la2-c2-ukb.salesforceliveagent.com/chat/rest/Visitor/Availability?Availability.ids=5732w000000HUCD&Availability.ids=5722w000000HSZd&org_id=00D2w00000CpQUW&Availability.needEstimatedWaitTime=0',
  headers: { 
    'X-LIVEAGENT-API-VERSION': '46'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});