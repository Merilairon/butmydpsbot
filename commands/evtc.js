const { embedSettings } = require("../config");
const { createLog } = require("../handlers/createlog");
const { extractDataFromLog } = require("../handlers/extractdatafromlog");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {

    const attachment = message.attachments.first();
    if (!attachment) {
      return message.reply("Please attach a log file .evtc, .zevtc, .zip");
    }
    message.channel.send({ embeds: [{
      color: embedSettings.color,
      title: "Loading ...",
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }]}).then(async msg => {
    
      const logLink = (await createLog(attachment.url)).permalink;
      extractDataFromLog(logLink);
      return { msg, logLink };
    })
      .then(({ msg, logLink }) => {
        msg.edit({ embeds: [{
          color: embedSettings.color,
          title: `here is your log file:\n${logLink}`,
          footer: {
            text: embedSettings.footertext,
            icon_url: embedSettings.footericon
          }
        }]});
      }).catch(e => {
        return message.channel.send({ embeds: [{
          color: embedSettings.wrongcolor,
          title: "❌ ERROR | An error occurred",
          description:`\`\`\`${e.stack}\`\`\``,
          footer: {
            text: embedSettings.footertext,
            icon_url: embedSettings.footericon
          }
        }]});
      });
  } catch (e) {
    return message.channel.send({ embeds: [{
      color: embedSettings.wrongcolor,
      title: "❌ ERROR | An error occurred",
      description:`\`\`\`${e.stack}\`\`\``,
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }]});
  }
};
  
exports.conf = {
  enabled: true,
  dmsOnly: false,
  guildOnly: false,
  aliases: ["log"],
  permLevel: "Administrator"
};
  
exports.help = {
  name: "evtc",
  category: "Information",
  description: "Returns the dps.report url based on the .(z)evtc/.zip log file.",
  usage: "evtc"
};


