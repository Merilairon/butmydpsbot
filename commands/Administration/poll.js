const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
    name: "poll",
    category: "Administration",
    aliases: [],
    cooldown: 2,
    usage: "poll <TITLE> ++ <OPTION 1> || <OPTION 2> || <OPTION 3> || ...",
    description: "Creates a poll with the given options",
    private: false,
    run: async (client, message, args, user, text, prefix) => {
    try{
      if(!args[0])
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | You didn't provide a Title, nor a Description`)
            .setDescription(`Usage: \`${prefix}${this.usage}\``)
        );
      let userargs = args.join(" ").split("++");
      let options = userargs.slice(1).join(" ").split("||");
      let title = userargs[0];
      let optionMessage = "";

      options.forEach((option, index) => {
          optionMessage += `:regional_indicator_${String.fromCharCode(97+index)}: ${option}\n\n`;
      })

      message.channel.send(new MessageEmbed()
        .setColor(ee.color).setFooter(ee.footertext, ee.footericon)
        .setTitle(title ? title : "")
        .setDescription(optionMessage ? optionMessage : "")
      ).then(msg => {
        options.forEach((option, index) => {
            msg.react(`\ud83c${String.fromCharCode(56806 + index)}`);
        })
      })
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

