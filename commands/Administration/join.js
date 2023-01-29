const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const gw2Client = require("gw2api-client")();
const ee = require("../../botconfig/embed.json");
const DiscordAccounts = mongoose.model("DiscordAccounts");

module.exports = {
    name: "join",
    category: "Administration",
    aliases: [],
    cooldown: 2,
    usage: "join",
    description: "Creates a squad join message",
    private: false,
    run: async (client, message, args, user, text, prefix) => {
    try{

      //Checks if discord account is connected to guildwars 2 api
      let account = await DiscordAccounts.findOne({
        discordId: message.author.id,
      });
      if (!account) {
          return message.channel.send(new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`❌ ERROR | You don't have your Guild Wars 2 account linked. Use the !!api command first!`)
              .setDescription(`Usage: \`${prefix}${this.usage}\``)
          );
      }

      gw2Client.authenticate(account.apiKey);
      let gw2AccountName = (await gw2Client.account().get()).name;
      message.channel.send(msg.guild.defaultRole.toString());
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`Squad Join Message - ${new Date(Date.now()).toDateString()}`)
        .setDescription(`@everyone\n\n/sqjoin ${gw2AccountName}`)
      );
    } catch (e) {
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}

