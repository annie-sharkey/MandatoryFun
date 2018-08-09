var express = require("express");
var request = require("request");
const { WebClient } = require("@slack/client");

const web = new WebClient(process.env.AUTH_TOKEN);
var clientId = "412008301361.412019981601";
var clientSecret = "80abffea5bb2e02faa3086a721a607d2";
const conversationID = "CC49F3WE8";

var bodyParser = require("body-parser");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const qs = require("querystring");

const axios = require("axios");
//define a port we want to listen to
const PORT = 4390;

//Starts our server
app.listen(PORT, function() {
  //Callback triggered when server is successfully listening
  console.log("Example app is listening on port " + PORT);
});

// This route handles GET requests to our root ngrok address
app.get("/", function(req, res) {
  res.send("Ngrok is working! Path Hit: " + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
// app.get("/oauth", function(req, res) {
//   // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
//   if (!req.query.code) {
//     res.status(500);
//     res.send({ Error: "Looks like we're not getting code." });
//     console.log("Looks like we're not getting code.");
//   } else {
//     // If it's there...

//     // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
//     request(
//       {
//         url: "https://slack.com/api/oauth.access", //URL to hit
//         qs: {
//           code: req.query.code,
//           client_id: clientId,
//           client_secret: clientSecret
//         }, //Query string data
//         method: "GET" //Specify the method
//       },
//       function(error, response, body) {
//         if (error) {
//           console.log(error);
//         } else {
//           res.json(body);
//         }
//       }
//     );
//   }
// });

app.post("/command/newcompetition", urlencodedParser, (req, res) => {
  // extract the verification token, slash command text,
  // and trigger ID from payload
  const { token, text, trigger_id } = req.body;

  // check that the verification token matches expected value
  if (token === process.env.VERIFICATION_TOKEN) {
    // create the dialog payload - includes the dialog structure, Slack API token,
    // and trigger ID
    const dialog = {
      token: process.env.AUTH_TOKEN,
      trigger_id,
      dialog: JSON.stringify({
        title: "Submit a helpdesk ticket",
        callback_id: "submit-ticket",
        submit_label: "Submit",
        elements: [
          {
            label: "Title",
            type: "text",
            name: "title",
            value: text,
            hint: "30 second summary of the problem"
          },
          {
            label: "Description",
            type: "textarea",
            name: "description",
            optional: true
          },
          {
            label: "Urgency",
            type: "select",
            name: "urgency",
            options: [
              { label: "Low", value: "Low" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" }
            ]
          }
        ]
      })
    };

    // open the dialog by calling dialogs.open method and sending the payload
    axios
      .post("https://slack.com/api/dialog.open", qs.stringify(dialog))
      .then(result => {
        debug("dialog.open: %o", result.data);
        res.send("");
      })
      .catch(err => {
        debug("dialog.open call failed: %o", err);
        res.sendStatus(500);
      });
  } else {
    debug("Verification token mismatch");
    res.sendStatus(500);
  }
});

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
  var postOptions = {
    uri: responseURL,
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    json: JSONmessage
  };
  request(postOptions, (error, response, body) => {
    if (error) {
      // handle errors as you see fit
    }
  });
}
//when the client runs the command, we do a post to our app that
//receives the request of new competition and sends our response
// app.post("/command/newcompetition", urlencodedParser, function(req, res) {
//   res.status(200).end();
//   console.log("trigger id: ", req.body.trigger_id);
//   var reqBody = req.body;
//   var responseURL = reqBody.response_url;
//   var trigger_id = reqBody.trigger_id;

//   if (reqBody.token != process.env.VERIFICATION_TOKEN) {
//     res.status(403).end("Access forbidden");
//   } else {
//     console.log("else entered");
//     web.dialog
//       .open({
//         token: process.env.AUTH_TOKEN,
//         trigger_id: trigger_id,
//         dialog: JSON.stringify({ title: "Create a new competition" })
//       })
//       .catch(console.error);
//   }

//   sendMessageToSlackResponseURL(responseURL, message);

//   web.dialog
//   .on({
//     channel: conversationID,
//     text: "testing that post message works"
//   })
//   .then(res => {
//     console.log("Dialog sent: ", res.ts);
//   })
//   .catch(console.error);

//   const { trigger_id } = req.body;

//   const dialog = {
//     token: process.env.SLACK_TOKEN,
//     trigger_id,
//     dialog: JSON.stringify({
//       title: "Submit a helpdesk ticket",
//       callback_id: "submit-ticket",
//       submit_label: "Submit",
//       elements: [
//         {
//           label: "Title",
//           type: "text",
//           name: "title",
//           value: text,
//           hint: "30 second summary of the problem"
//         },
//         {
//           label: "Description",
//           type: "textarea",
//           name: "description",
//           optional: true
//         },
//         {
//           label: "Urgency",
//           type: "select",
//           name: "urgency",
//           options: [
//             { label: "Low", value: "Low" },
//             { label: "Medium", value: "Medium" },
//             { label: "High", value: "High" }
//           ]
//         }
//       ]
//     })
//   };

//   web.dialog.open(dialog);
// });

//endpoint to receive dialog submission
// app.post('/dialog/newcompetition', (req, res) => {

// })

// var message = {
//     text: "This is your first interactive message",
//     attachments: [
//       {
//         text: "Building buttons is easy right?",
//         fallback: "Shame... buttons aren't supported in this land",
//         callback_id: "button_tutorial",
//         color: "#3AA3E3",
//         attachment_type: "default",
//         actions: [
//           {
//             name: "yes",
//             text: "yes",
//             type: "button",
//             value: "yes"
//           },
//           {
//             name: "no",
//             text: "no",
//             type: "button",
//             value: "no"
//           },
//           {
//             name: "maybe",
//             text: "maybe",
//             type: "button",
//             value: "maybe",
//             style: "danger"
//           }
//         ]
//       }
//     ]
//   };
