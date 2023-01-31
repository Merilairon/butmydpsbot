const { embedSettings } = require("../config");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    return message.channel.send({ embeds: [{
      color: embedSettings.color,
      title: "You died",
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
  aliases: ["surrender", "concede", "forfeit", "ff", "gg", "qq"],
  permLevel: "Administrator"
};
  
exports.help = {
  name: "resign",
  category: "Information",
  description: "Commit sudoku",
  usage: "resign"
};
