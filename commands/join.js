const mongoose = require("mongoose");
const gw2Client = require("gw2api-client")();

const { embedSettings } = require("../config");

const DiscordAccounts = mongoose.model("DiscordAccounts");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    
    const settings = message.settings;

    //Checks if discord account is connected to guildwars 2 api
    const account = await DiscordAccounts.findOne({
      discordId: message.author.id,
    });
    if (!account) {
      return message.channel.send({ embeds: [{
        color: embedSettings.wrongcolor,
        title: `❌ ERROR | You don't have your Guild Wars 2 account linked. Use the ${settings.prefix}api command first!`,
        description:`Usage: \`${settings.prefix}join\``,
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
    }
  
    gw2Client.authenticate(account.apiKey);
    const gw2AccountName = (await gw2Client.account().get()).name;

    return message.channel.send({
      content: "@everyone",
      embeds: [{
        color: embedSettings.color,
        title: `Squad Join Message - ${new Date(Date.now()).toDateString()}`,
        description:`/sqjoin ${gw2AccountName}`,
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
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
  name: "join",
  category: "Administration",
  description: "Creates a squad join message",
  usage: "join"
};
  