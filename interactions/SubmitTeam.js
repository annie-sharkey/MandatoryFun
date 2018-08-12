const { WebClient } = require("@slack/client");
const web = new WebClient(process.env.AUTH_TOKEN);
var selectedChannel;

exports.submitTeam = function(body) {
  console.log("body: ", body);
  if (body.actions[0].name === "channels_menu") {
    selectedChannel = body.actions[0].selected_options[0].value;
  } else if (
    body.actions[0].name === "select_team_button" &&
    selectedChannel != null
  ) {
    web.chat
      .postMessage({
        channel: body.channel.id,
        text: `You added ${selectedChannel} to your competition [TODO:insert competition title here]. 
        \n Would you like to add another team?`,
        attachments: [
          {
            fallback: "Upgrade your Slack client to use messages like these.",
            color: "#3AA3E3",
            attachment_type: "default",
            callback_id: "add_another_team",
            actions: [
              {
                name: "yes_another_team",
                text: "Yes",
                type: "button"
              },
              {
                name: "no_another_team",
                text: "No",
                type: "button"
              }
            ]
          }
        ]
      })
      .catch(console.error);
  } else if (
    body.actions[0].name === "select_team_button" &&
    selectedChannel == null
  ) {
    web.chat
      .postMessage({
        channel: body.channel.id,
        text: `Choose a team to add to your competition.`
      })
      .catch(console.error);
  } else {
    console.log("error ");
  }
};
