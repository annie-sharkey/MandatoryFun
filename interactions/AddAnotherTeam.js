const { WebClient } = require("@slack/client");
const web = new WebClient(process.env.AUTH_TOKEN);

exports.addAnotherTeam = function(body) {
  const action = body.actions[0].name;

  if (action === "no_another_team") {
    console.log("Did not add another team");
  } else {
    web.chat
      .postMessage({
        channel: body.channel.id,
        text: `Add another team to *_$[competitionName]_* by selecting a channel.`,
        attachments: [
          {
            fallback: "Upgrade your Slack client to use messages like these.",
            color: "#3AA3E3",
            attachment_type: "default",
            callback_id: "add_team_to_competition",
            actions: [
              {
                name: "channels_menu",
                type: "select",
                data_source: "channels"
              },
              {
                name: "select_team_button",
                text: "Select Team",
                type: "button"
              }
            ]
          }
        ]
      })
      .catch(console.error);
  }
};
