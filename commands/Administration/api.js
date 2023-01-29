const { MessageEmbed, MessageCollector } = require("discord.js");
const mongoose  = require("mongoose");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");

const DiscordAccounts = mongoose.model("DiscordAccounts");
const r = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{20}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/g; // API Key Regex

module.exports = {
  name: "api",
  category: "Administration",
  aliases: [""],
  cooldown: 2,
  usage: "api <add/remove> [API-KEY]",
  description: "Links your Guild Wars 2 API key to your discord account",
  private: true,
  run: async (client, message, args, user, text, prefix) => {
    try {
      if (!args[0])
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | You didn't provide an option nor an API key`)
          .setDescription(`Usage: \`${prefix}${this.usage}\``)
        );

      if (args[0] === "add") {
        if (!args[1]) {
          return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | You didn't provide an API key`)
            .setDescription(`Usage: \`${prefix}${this.usage}\``)
          );
        }

        if (!args[1].match(r)) {
          return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | The given API key is not valid! Try again.`)
            .setDescription(`Usage: \`${prefix}${this.usage}\``)
          );
        }

        let da = new DiscordAccounts({
          discordId: message.author.id,
          apiKey: args[1],
        });
        da.save();
        message.reply("Your Guild Wars 2 API key has been added");
      }

      else if (args[0] === "remove") {
        await DiscordAccounts.deleteOne({ discordId: message.author.id });
        return message.reply("Your Guild Wars 2 API key has been removed or you never linked it");
      }

      else {
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | No option for adding or removing was given.`)
          .setDescription(`Usage: \`${prefix}${this.usage}\``)
        );
      }

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

