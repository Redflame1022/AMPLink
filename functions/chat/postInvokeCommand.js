//AMPLink Server Controllers
//Made by sam

const request = require('request');
require('dotenv').config();

exports.postInvokeCommand = async function (string) {
  string = JSON.stringify(string)
  var send = `{"command": ${string} }`
  JSON.parse(send)
  const bearerToken = `${process.env.TORCHREMOTE_TOKEN}`
  const options = {
    url: `${process.env.TORCHREMOTE_ADDRESS}/api/v1/chat/command`,
    body: send,
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    }
    
  };
  return new Promise((resolve) => {
  request.post(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    if (response.statusCode == 401) {
      console.log("[E008] Error accessing remote data.")
      resolve(response.statusCode);
    } else if (response.statusCode == 503) {
      console.log("[E012] Server connection cannot be established. This could be due to the server being down or offline.")
      resolve(response.statusCode);
    } else if (response.statusCode != 200){
      console.log(`[E009] Error accessing remote data with a status code of ${response.statusCode}.`)
      resolve(response.statusCode);
    }
    resolve(response.body);
  });
});
};

/* For debugging
var postInvokeCommand = require(__dirname + '/postInvokeCommand.js');

(async () => {
  console.log(await postInvokeCommand.postInvokeCommand('notify "test" 1000'));
})();
*/