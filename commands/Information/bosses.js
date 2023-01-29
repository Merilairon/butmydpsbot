const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const gw2Client = require("gw2api-client")();
const wings = require("../../botconfig/wings");
const ee = require("../../botconfig/embed.json");
const encounterIds = require("../../botconfig/encounterIds");
const DiscordAccounts = mongoose.model("DiscordAccounts");
const Logs = mongoose.model("Logs");

module.exports = {
    name: "bosses",
    category: "Information",
    aliases: ["logs"],
    cooldown: 2,
    usage: "bosses [raids/strikes]",
    description: "Returns the weekly embed of dps.report url for all the raid bosses.",
    private: false,
    run: async (client, message, args, user, text, prefix) => {
        try {
            //Checks if discord account is connected to guildwars 2 api
            let account = await DiscordAccounts.findOne({
                discordId: message.author.id,
            });
            if (!account) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`❌ ERROR | You don't have your Guild Wars 2 account linked. Use the !!api command first!`)
                    .setDescription(`\`\`\`${e.stack}\`\`\``)
                );
            }

            let msg = new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`${(args[0] === "strikes" || args[0] === "raids") ? `Loading ${args[0]}...` : "No option (raids or strikes) provided, continuing with raid logs.\n\nLoading..."}`);
            msg = await message.channel.send(msg);

            let gw2AccountName, completedBosses;
            gw2Client.authenticate(account.apiKey);
            gw2AccountName = (await gw2Client.account().get()).name;
            completedBosses = await gw2Client.account().raids().get();

            let logs = await Logs.find({
                date: { $gte: getMonday() },
                encounterType: args[0] === "strikes" ? "strike_mission" : "raid",
                players: gw2AccountName,
                success: true
            });

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`${args[0] === "strikes" ? "Strike mission" : "Raid"} logs ${getMonday().toDateString()} - ${getSunday().toDateString()}`)
            let fields = [];


            if (args[0] === "strikes") {
                let strikeNames = new Set(logs.map(l => l.name));
                strikeNames.forEach((name) => {
                    let wingDescription = "";

                    logs.filter((l) => l.name === name).forEach(l => wingDescription += `[${l.duration}](${l.link})\n`);

                    fields.push({
                        name: `${name}`,
                        value: wingDescription,
                    })
                });

            } else {
                wings.forEach(({ name, bosses }) => {
                    let wingDescription = "";

                    bosses.forEach(encounterId => {
                        let log = logs.filter((l) => l.encounterId === encounterId);

                        wingDescription +=
                            `${completedBosses.includes(encounterIds[encounterId].apiName) ? ":white_check_mark:" : ":x:"} ${encounterIds[encounterId].name}\n`;
                        log.forEach(
                            (l, index) =>
                                (wingDescription += `\u2003\u2003[${l.duration}](${l.link})\n`)
                        );
                    });
                    fields.push({
                        name: `${name}`,
                        value: wingDescription,
                    });
                });
            }
            fields.forEach((f) => {
                embed.addField(f.name, f.value, true);
            });
            msg.edit(embed);
        } catch (e) {
            console.error(e)
        }
    }
}

function getMonday() {
    let d = new Date()
    d.setUTCHours(7);
    d.setUTCMinutes(30);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

    return new Date(d.setDate(diff));
}

function getSunday() {
    let d = new Date();
    d.setDate(getMonday().getDate() + 6);
    return d;
}

