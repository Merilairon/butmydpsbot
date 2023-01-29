const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
    name: "temprole",
    category: "Administration",
    aliases: ["temp"],
    cooldown: 2,
    usage: "temp <@username>",
    description: "Giver mentioned user a 24h role",
    private: false,
    run: async (client, message, args, user, text, prefix) => {
        try {
            if (!args[0])
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`❌ ERROR | You didn't provide a Title, nor a Description`)
                    .setDescription(`Usage: \`${prefix}${this.usage}\``)
                )
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle("Giving a temporary role to XXX")
                .setDescription("Still under construction.")
            )
        } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            );
        }
    }
}

