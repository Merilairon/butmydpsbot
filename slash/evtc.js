const { embedSettings } = require("../config");
const { createLog } = require("../handlers/createlog");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({
    ephemeral: true
  });

  try {

    const attachment = interaction.options.getAttachment("logfile");
    if (!attachment) {
      return interaction.editReply({ content: "Please attach a log file .evtc, .zevtc, .zip", ephemeral: true});
    }
    await interaction.editReply({ embeds: [{
      color: embedSettings.color,
      title: "Loading ...",
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }],
    ephemeral: true
    });
    const logLink = (await createLog(attachment.url)).permalink;

    interaction.editReply({ embeds: [{
      color: embedSettings.color,
      title: `here is your log file:\n${logLink}`,
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }],
    ephemeral: true
    });
  } catch (e) {
    return interaction.editReply({ embeds: [{
      color: embedSettings.wrongcolor,
      title: "❌ ERROR | An error occurred",
      description:`\`\`\`${e.stack}\`\`\``,
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }],
    ephemeral: true
    });
  }
};

exports.commandData = {
  name: "evtc",
  description: "Returns the dps.report url based on the .(z)evtc/.zip log file.",
  options: [
    {
      // Name of the subcommand
      "name": "logfile",
      // Short description of subcommand
      "description": "arcdps log file .zevtc or .evtc or .zip",
      // Type of input from user: https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
      "type": 11,
      // Whether the subcommand is required
      "required": true,
    }
  ],//
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  dmsOnly: false,
  guildOnly: true
};
