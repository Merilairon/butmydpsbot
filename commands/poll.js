
const { embedSettings } = require("../config");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {

    const settings = message.settings;

    if (!args[0])
      return message.channel.send({ embeds: [{
        color: embedSettings.wrongcolor,
        title: "❌ ERROR | You didn't provide a Title, nor a Description",
        description:`Usage: \`${settings.prefix}poll <TITLE> ++ <OPTION 1> || <OPTION 2> || <OPTION 3> || ...\``,
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
    const userargs = args.join(" ").split("++");
    const options = userargs.slice(1).join(" ").split("||").filter(option=> option.trim() !== "");
    const title = userargs[0];
    let optionMessage = "";

    if (options.length === 0)
      return message.channel.send({ embeds: [{
        color: embedSettings.wrongcolor,
        title: "❌ ERROR | You didn't provide any Options",
        description:`Usage: \`${settings.prefix}poll <TITLE> ++ <OPTION 1> || <OPTION 2> || <OPTION 3> || ...\``,
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
    
    options.forEach((option, index) => {
      optionMessage += `:regional_indicator_${String.fromCharCode(97+index)}: ${option}\n\n`;
    });

    const msg = message.channel.send({ embeds: [{
      color: embedSettings.color,
      title: title? title : "",
      description: optionMessage ? optionMessage : "",
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }]});
    
    msg.then(msg => {
      options.forEach((option, index) => {
        msg.react(`\ud83c${String.fromCharCode(56806 + index)}`);
      });
    });

    return msg;

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
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};
  
exports.help = {
  name: "poll",
  category: "Administration",
  description: "Creates a poll with the given options",
  usage: "poll <TITLE> ++ <OPTION 1> || <OPTION 2> || <OPTION 3> || ..."
};
  