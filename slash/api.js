const mongoose  = require("mongoose");

const { embedSettings } = require("../config");

const r = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{20}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/g; // API Key Regex
const DiscordAccounts = mongoose.model("DiscordAccounts");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({
    ephemeral: true
  });

  try {
  
    if (interaction.options.getString("action") === "add") {
      if (!interaction.options.getString("apikey")) {
        return interaction.editReply({ embeds: [{
          color: embedSettings.wrongcolor,
          title: "❌ ERROR | You didn't provide an API key",
          description:"Usage: `\\api <add/remove> [API-KEY]`",
          footer: {
            text: embedSettings.footertext,
            icon_url: embedSettings.footericon
          }
        }], ephemeral: true });
      }
  
      if (!interaction.options.getString("apikey").match(r)) {
        return interaction.editReply({ embeds: [{
          color: embedSettings.wrongcolor,
          title: "❌ ERROR | The given API key is not valid! Try again.",
          description:"Usage: `\\api <add/remove> [API-KEY]`",
          footer: {
            text: embedSettings.footertext,
            icon_url: embedSettings.footericon
          }
        }], ephemeral: true });
      }
      const da = new DiscordAccounts({
        discordId: interaction.user.id,
        apiKey: interaction.options.getString("apikey"),
      });
      da.save();
      interaction.editReply({ content: "Your Guild Wars 2 API key has been added", ephemeral: true});//TODO: change to embed
    }
  
    else if (interaction.options.getString("action") === "remove") {
      await DiscordAccounts.deleteOne({ discordId: interaction.user.id });
      return interaction.editReply({ content: "Your Guild Wars 2 API key has been removed or you never linked it", ephemeral: true});//TODO: change to embed
    }
  
    else {
      return interaction.editReply({ embeds: [{
        color: embedSettings.wrongcolor,
        title: "❌ ERROR | No option for adding or removing was given.",
        description:"Usage: `\\api <add/remove> [API-KEY]`",
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }], ephemeral: true });
    }
  
  } catch (e) {
    return interaction.editReply({ embeds: [{
      color: embedSettings.wrongcolor,
      title: "❌ ERROR | An error occurred",
      description:`\`\`\`${e.stack}\`\`\``,
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }], ephemeral: true });
  }
};

exports.commandData = {
  name: "api",
  description: "Links your Guild Wars 2 API key to your discord account",
  options: [
    {
      // Name of the subcommand
      "name": "action",
      // Short description of subcommand
      "description": "Either remove or add api key",
      // Type of input from user: https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
      "type": 3,
      // Whether the subcommand is required
      "required": true,
      // If the subcommand is a string, you can specify choices that the user must select
      "choices": [
        {
          "name": "add",
          "value": "add"
        },
        {
          "name": "remove",
          "value": "remove"
        }
      ]
    },
    {
      // Name of the subcommand
      "name": "apikey",
      // Short description of subcommand
      "description": "Either remove or add api key",
      // Type of input from user: https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
      "type": 3,
      // Whether the subcommand is required
      "required": false,
      // If the subcommand is a string, you can specify choices that the user must select
      "choices": []
    }
  ],//
  defaultPermission: false,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  dmsOnly: false,
  guildOnly: false
};
