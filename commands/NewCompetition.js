const { WebClient } = require("@slack/client");
const web = new WebClient(process.env.AUTH_TOKEN);

exports.newCompetition = function(req, res) {
  const { token, trigger_id } = req.body;

  // check that the verification token matches expected value
  if (token === process.env.VERIFICATION_TOKEN) {
    const dialog = JSON.stringify({
      title: "Create a new competition",
      callback_id: "submit-new-competition",
      submit_label: "Next",
      elements: [
        {
          label: "Competition Title",
          type: "text",
          name: "title",
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
};
