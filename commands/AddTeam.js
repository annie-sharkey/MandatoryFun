const { WebClient } = require("@slack/client");
const web = new WebClient(process.env.AUTH_TOKEN);

exports.addTeam = function(body, channelID) {
  console.log("add team body:", body);
  //   console.log("body: ", req.body.user_name);
  // console.log("text: ", req.body.text);

  // const channelID = body.channel_id;
  const competitionName = body.text;

  //TODO: when I connect to db, check that channel isn't already added to the list and that
  //competition name presented exists
  if (competitionName === "") {
    web.chat
      .postMessage({
        channel: channelID,
        text:
          "*`/add_team` must be called with the name of an existing competition*"
      })
      .catch(console.error);
  } else {
    web.chat
      .postMessage({
        channel: channelID,
        text: `Add a team to *_${competitionName}_* by selecting a channel.`,
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

  //choose one channel and hit add
  //then that gets stored with competition name
};
