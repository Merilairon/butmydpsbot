const mongoose  = require("mongoose");

const { embedSettings } = require("../config");

const r = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{20}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/g; // API Key Regex
const DiscordAccounts = mongoose.model("DiscordAccounts");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {

    const settings = message.settings;

    if (!args[0])
      return message.channel.send({ embeds: [{
        color: embedSettings.wrongcolor,
        title: "❌ ERROR | You didn't provide an option nor an API key",
        description:`Usage: \`${settings.prefix}api <add/remove> [API-KEY]\``,
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
  
    if (args[0] === "add") {
      if (!args[1]) {
        return message.channel.send({ embeds: [{
          color: embedSettings.wrongcolor,
          title: "❌ ERROR | You didn't provide an API key",
          description:`Usage: \`${settings.prefix}api <add/remove> [API-KEY]\``,
          footer: {
            text: embedSettings.footertext,
            icon_url: embedSettings.footericon
          }
        }]});
      }
  
      if (!args[1].match(r)) {
        return message.channel.send({ embeds: [{
          color: embedSettings.wrongcolor,
          title: "❌ ERROR | The given API key is not valid! Try again.",
          description:`Usage: \`${settings.prefix}api <add/remove> [API-KEY]\``,
          footer: {
            text: embedSettings.footertext,
            icon_url: embedSettings.footericon
          }
        }]});
      }
  
      const da = new DiscordAccounts({
        discordId: message.author.id,
        apiKey: args[1],
      });
      da.save();
      message.reply("Your Guild Wars 2 API key has been added");
    }
  
    else if (args[0] === "remove") {
      await DiscordAccounts.deleteOne({ discordId: message.author.id });
      return message.reply("Your Guild Wars 2 API key has been removed or you never linked it");
    }
  
    else {
      return message.channel.send({ embeds: [{
        color: embedSettings.wrongcolor,
        title: "❌ ERROR | No option for adding or removing was given.",
        description:`Usage: \`${settings.prefix}api <add/remove> [API-KEY]\``,
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
    }
  
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
  dmsOnly: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Administrator"
};
  
exports.help = {
  name: "api",
  category: "Administration",
  description: "Links your Guild Wars 2 API key to your discord account",
  usage: "api <add/remove> [API-KEY]"
};
  