const mongoose = require("mongoose");
const gw2Client = require("gw2api-client")();

const { embedSettings } = require("../config");

const DiscordAccounts = mongoose.model("DiscordAccounts");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  try {
    
    await interaction.deferReply({
      ephemeral: true
    });

    //Checks if discord account is connected to guildwars 2 api
    const account = await DiscordAccounts.findOne({
      discordId: interaction.user.id,
    });
    if (!account) {
      return interaction.editReply({
        embeds: [{
          color: embedSettings.wrongcolor,
          title: "❌ ERROR | You don't have your Guild Wars 2 account linked. Use the /api command first!",
          description:"Usage: /join`",
          footer: {
            text: embedSettings.footertext,
            icon_url: embedSettings.footericon
          }
        }],
        ephemeral: true
      });
    }
  
    gw2Client.authenticate(account.apiKey);
    const gw2AccountName = (await gw2Client.account().get()).name;
    
    interaction.channel.send({
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
    return interaction.editReply({content: "Join Message Created"});
    
  } catch (e) {
    return interaction.editReply({
      embeds: [{
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
  name: "join",
  description: "Creates a squad join message.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  dmsOnly: false,
  guildOnly: false
};
