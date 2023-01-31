const mongoose = require("mongoose");
const gw2Client = require("gw2api-client")();
const { encounterIds, wings } = require("../guild-wars-data");

const DiscordAccounts = mongoose.model("DiscordAccounts");
const Logs = mongoose.model("Logs");

const { embedSettings } = require("../config");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    //Checks if discord account is connected to guildwars 2 api
    const account = await DiscordAccounts.findOne({
      discordId: message.author.id,
    });
    if (!account) {
      return message.channel.send({ embeds: [{
        color: embedSettings.wrongcolor,
        title: "❌ ERROR | You don't have your Guild Wars 2 account linked. Use the !!api command first!",
        footer: {
          text: embedSettings.footertext,
          icon_url: embedSettings.footericon
        }
      }]});
    }

    const msg = message.channel.send({ embeds: [{
      color: embedSettings.color,
      title: `${(args[0] === "strikes" || args[0] === "raids") ? `Loading ${args[0]}...` : "No option (raids or strikes) provided, continuing with raid logs.\n\nLoading..."}`,
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
      encounterType: args[0] === "strikes" ? "strike_mission" : "raid",
      players: gw2AccountName,
      success: true
    });

    const embed = {
      color: embedSettings.color,
      title: `${args[0] === "strikes" ? "Strike mission" : "Raid"} logs ${getMonday().toDateString()} - ${getSunday().toDateString()}`,
      footer: {
        text: embedSettings.footertext,
        icon_url: embedSettings.footericon
      }
    };
    const fields = [];


    if (args[0] === "strikes") {
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

exports.conf = {
  enabled: true,
  dmsOnly: false,
  guildOnly: false,
  aliases: ["logs"],
  permLevel: "Administrator"
};
    
exports.help = {
  name: "bosses",
  category: "Information",
  description: "Returns the weekly embed of dps.report url for all the raid bosses.",
  usage: "bosses [raids/strikes]"
};