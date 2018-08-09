var express = require("express");
const { WebClient } = require("@slack/client");

const web = new WebClient(process.env.AUTH_TOKEN);

var bodyParser = require("body-parser");
var app = express();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.post("/command/newcompetition", (req, res) => {
  const { token, text, trigger_id } = req.body;

  // check that the verification token matches expected value
  if (token === process.env.VERIFICATION_TOKEN) {
    const dialog = JSON.stringify({
      title: "Create a new competition",
      callback_id: "submit-ticket",
      submit_label: "Next",
      elements: [
        {
          label: "Competition Title",
          type: "text",
          name: "title",
          value: text,
          placeholder: "Give your competition a unique name"
        },
        {
          label: "Description",
          type: "textarea",
          name: "description",
          placeholder: "Tell your teams a little about the competition"
        }
      ]
    });

    web.dialog
      .open({
        token: process.env.AUTH_TOKEN,
        trigger_id: trigger_id,
        dialog: dialog
      })
      .then(result => {
        res.send("");
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    debug("Verification token mismatch");
    res.sendStatus(500);
  }
});
