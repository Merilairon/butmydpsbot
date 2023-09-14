const { embedSettings } = require("../config");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();
  try {
    return interaction.editReply({ embeds: [{
      color: embedSettings.color,
      title: "You died",
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }]});
  } catch (e) {
    return interaction.editReply({ embeds: [{
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
  
exports.commandData = {
  name: "resign",
  description: "Commit sudoku",
  options: [],
  defaultPermission: true,
};
  
// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Administrator",
  dmsOnly: false,
  guildOnly: false
};

