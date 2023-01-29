const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { createLog } = require("../../handlers/createlog");
const { extractDataFromLog } = require("../../handlers/extractdatafromlog");

module.exports = {
    name: "evtc",
    category: "Information",
    aliases: ["log"],
    cooldown: 2,
    usage: "evtc",
    description: "Returns the dps.report url based on the .(z)evtc/.zip log file.",
    private: false,
    run: async (client, message, args, user, text, prefix) => {
        try {

            let attachment = message.attachments.first();
            if (!attachment) {
                return message.reply("Please attach a log file .evtc, .zevtc, .zip");
            }

            let msg = new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`Loading ...`);
            message.channel.send(msg)
                .then(async msg => {

                    let logLink = (await createLog(attachment.url)).permalink;
                    extractDataFromLog(logLink);
                    return { msg, logLink }
                })
                .then(({ msg, logLink }) => {
                    msg.edit(new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`here is your log file:\n${logLink}`));
                }).catch(e => {
                    console.log(String(e.stack).bgRed)
                    return message.channel.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ ERROR | An error occurred`)
                        .setDescription(`\`\`\`${e.stack}\`\`\``)
                    );
                });
        } catch (e) {
            console.error(e);
            message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            );
        }
    }
}


