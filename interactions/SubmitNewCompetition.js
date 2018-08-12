const { WebClient } = require("@slack/client");
const web = new WebClient(process.env.AUTH_TOKEN);

exports.submitNewCompetition = function(body) {
  web.chat
    .postMessage({
      channel: body.channel.id,
      text: `You just created the competition *${body.submission.title}*.`
    })
    .catch(console.error);
};
