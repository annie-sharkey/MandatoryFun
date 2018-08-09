const { IncomingWebhook, WebClient } = require("@slack/client");

console.log("Getting started with Slack Developer Kit for Node.js");

const web = new WebClient(process.env.SLACK_TOKEN);

const conversationID = "CC49F3WE8";

// web.chat
//   .postMessage({
//     channel: conversationID,
//     text: "testing that post message works"
//   })
//   .then(res => {
//     console.log("Message sent: ", res.ts);
//   })
//   .catch(console.error);

// const timeNotification = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
// const currentTime = new Date().toTimeString();

// timeNotification.send(`The current time is ${currentTime}`, (error, resp) => {
//   if (error) {
//     return console.error(error);
//   }
//   console.log("Notification sent");
//   console.log("Waiting a few seconds for search indexes to update...");

module.exports = {
  fun: function() {
    setTimeout(() => {
      console.log("Calling search.messages");

      //searches for
      web.search
        .messages({ query: "new competition" })
        .then(resp => {
          if (resp.messages.total > 0) {
            console.log("First match:", resp.messages.matches[0].text);
            web.chat
              .postMessage({
                channel: conversationID,
                text: "testing that post message works"
              })
              .then(res => {
                console.log("Message sent: ", res.ts);
              })
              .catch(console.error);
          } else {
            console.log("No matches found");
          }

          // web.channels
          //   .list()
          //   .then(resp => {
          //     //   for (item in resp.channels) {
          //     //     console.log(item.name);
          //     //   }
          //     console.log(resp.channel);
          //     //   console.log("channel history response: ", resp.channels.name);
          //   })
          //   .catch(console.error);
        })
        .catch(console.error);
    }, 32000);
  }
};

// });
