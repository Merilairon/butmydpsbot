const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
    name: "invite",
    category: "Administration",
    aliases: ["inv"],
    cooldown: 2,
    usage: "invite",
    description: "Creates an invite link to this server",
    private: false,
    run: async (client, message, args, user, text, prefix) => {
    try{
      if (!message.guild) {
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | You need to use this command in a guild channel to create an invite link.`)
            .setDescription(`Usage: \`${prefix}${this.usage}\``)
        );
      }

      let invite = await message.channel.createInvite();

      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`Invite Link - ${new Date(Date.now()).toDateString()}`)
        .setDescription(`${invite}\n\nRequested by ${message.author.tag}`)
      );
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

