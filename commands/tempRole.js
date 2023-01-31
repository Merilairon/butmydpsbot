const { embedSettings } = require("../config");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    
    const settings = message.settings;

    if (!args[0])
      return message.channel.send({ embeds: [{
        color: embedSettings.wrongcolor,
        title: "❌ ERROR | You didn't provide a user for a temporary role",
        description:`Usage: \`${settings.prefix}temp <@username>\``,
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
    return message.channel.send({ embeds: [{
      color: embedSettings.color,
      title: "Giving a temporary role to XXX",
      description: "Still under construction.",
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
  enabled: false,
  dmsOnly: false,
  guildOnly: true,
  aliases: ["temp"],
  permLevel: "Administrator"
};
  
exports.help = {
  name: "temprole",
  category: "Administration",
  description: "Giver mentioned user a 24h role",
  usage: "temp <@username>"
};