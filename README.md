# But My DPS Bot

This is based on a discord bot by the [Idiot's Guide Community](https://discord.gg/vXVxsAjSMF).

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win) | [Linux](https://git-scm.com/download/linux) | [MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 16.x](https://nodejs.org)
- The node-gyp build tools. This is a pre-requisite for Enmap, but also for a **lot** of other modules. See [The Enmap Guide](https://enmap.evie.codes/install#pre-requisites) for details and requirements for your OS. Just follow what's in the tabbed block only, then come back here!

You also need your bot's token. This is obtained by creating an application in
the Developer section of discord.com. Check the [first section of this page](https://anidiots.guide/getting-started/getting-started-long-version)
for more info.

## Intents

You can enable privileged intents in your bot page
(the one you got your token from) under `Privileged Gateway Intents`.

By default GuideBot needs the Guilds, Guild Messages and Direct Messages intents to work.
For join messages to work you need Guild Members, which is privileged.
User counts that GuideBot has in places such as in the ready log, and the stats
command may be incorrect without the Guild Members intent.

Intents are loaded from the index.js file, and the installer is pre-set with the Guilds, Guild Messages and Direct Messages intents.

For more info about intents checkout the [official Discord.js guide page](https://discordjs.guide/popular-topics/intents.html) and the [official Discord docs page](https://discord.com/developers/docs/topics/gateway#gateway-intents).

## Downloading

Create a folder within your projects directory and run the following inside it:

`git clone https://onedev.merilairon.com/butmydpsbot .`

Once finished:

- In the folder from where you ran the git command, run `npm install`, which will install the required packages.
- **If you get any error about python or msibuild.exe or binding, read the requirements section again!**
- Rename `config.js.example` to `config.js`, and give it the required intents and any partials you may require.
- Rename `.env-example` to `.env` and put in your bot token in it and save.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it.

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[Permission Calculator](https://finitereality.github.io/permissions-calculator/?v=0)
