const mongoose = require("mongoose");
const gw2Client = require("gw2api-client")();
const { encounterIds, wings } = require("../guild-wars-data");

const DiscordAccounts = mongoose.model("DiscordAccounts");
const Logs = mongoose.model("Logs");

const { embedSettings } = require("../config");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();

  try {
    //Checks if discord account is connected to guildwars 2 api
    const account = await DiscordAccounts.findOne({
      discordId: interaction.user.id,
    });
    if (!account) {
      return interaction.editReply({ embeds: [{
        color: embedSettings.wrongcolor,
        title: "❌ ERROR | You don't have your Guild Wars 2 account linked. Use the !!api command first!",
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
    }

    const msg = interaction.editReply({ embeds: [{
      color: embedSettings.color,
      title: `${interaction.options.getString("type") === "strikes" || interaction.options.getString("type") === "raids" ? `Loading ${interaction.options.getString("type")}...` : "No option (raids or strikes) provided, continuing with raid logs.\n\nLoading..."}`,
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    }]});

    gw2Client.authenticate(account.apiKey);
    const gw2AccountName = (await gw2Client.account().get()).name;
    const completedBosses = await gw2Client.account().raids().get();

    const logs = await Logs.find({
      date: { $gte: getMonday() },
      encounterType: interaction.options.getString("type") === "strikes" ? "strike_mission" : "raid",
      players: gw2AccountName,
      success: true
    });

    const embed = {
      color: embedSettings.color,
      title: `${interaction.options.getString("type") === "strikes" ? "Strike mission" : "Raid"} logs ${getMonday().toDateString()} - ${getSunday().toDateString()}`,
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    };
    const fields = [];


    if (interaction.options.getString("type") === "strikes") {
      const strikeNames = new Set(logs.map(l => l.name));
      strikeNames.forEach((name) => {
        let wingDescription = "";

        logs.filter((l) => l.name === name).forEach(l => wingDescription += `[${l.duration}](${l.link})\n`);

        fields.push({
          name: `${name}`,
          value: wingDescription,
        });
      });

    } else {
      wings.forEach(({ name, bosses }) => {
        let wingDescription = "";

        bosses.forEach(encounterId => {
          const log = logs.filter((l) => l.encounterId === encounterId);

          wingDescription += `${completedBosses.includes(encounterIds[encounterId].apiName) ? ":white_check_mark:" : ":x:"} ${encounterIds[encounterId].name}\n`;
          log.forEach(
            (l) => {
              wingDescription += `\u2003\u2003[${l.duration}](${l.link})\n`;
            }
          );
        });

        fields.push({
          name: `${name}`,
          value: wingDescription,
          inline: true
        });
      });
    }
    embed.fields = fields;

    msg.then(m => m.edit({ embeds: [embed]}));
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

function getMonday() {
  const d = new Date();
  d.setUTCHours(7);
  d.setUTCMinutes(30);
  d.setUTCSeconds(0);
  d.setUTCMilliseconds(0);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

  return new Date(d.setDate(diff));
}

function getSunday() {
  const d = new Date();
  d.setDate(getMonday().getDate() + 6);
  return d;
}
  
exports.commandData = {
  name: "bosses",
  description: "Returns the weekly embed of dps.report url for all the raid bosses.",
  options: [
    {
      // Name of the subcommand
      "name": "type",
      // Short description of subcommand
      "description": "The type of encounters to get logs for",
      // Type of input from user: https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
      "type": 3,
      // Whether the subcommand is required
      "required": false,
      // If the subcommand is a string, you can specify choices that the user must select
      "choices": [
        {
          "name": "strikes",
          "value": "strikes"
        },
        {
          "name": "raids",
          "value": "raids"
        }
      ]
    }
  ],//
  defaultPermission: true,
};
  
// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Administrator",
  dmsOnly: false,
  guildOnly: false
};
