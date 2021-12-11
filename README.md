<img width="160" height="160" align="left" style="float: left; margin: 0 10px 0 0;" alt="Tarkov Helper" src="https://raw.githubusercontent.com/Tarkov-Helper/Tarkov-Helper-Assets/main/Media/Logo250x250.png">

# Tarkov Helper

[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![language](https://img.shields.io/badge/language%20-typescript-blue?style=flat)](https://www.typescriptlang.org)
[![library](https://img.shields.io/badge/library-discordx-blue?style=flat)](https://www.npmjs.com/package/discordx)
[![license](https://img.shields.io/github/license/BetrixDev/Tarkov-Helper)](https://github.com/BetrixDev/Tarkov-Helper/blob/master/LICENSE)

[![Discord Bots](https://top.gg/api/widget/status/797600238449590334.svg)](https://top.gg/bot/797600238449590334) [![Discord Bots](https://top.gg/api/widget/servers/797600238449590334.svg)](https://top.gg/bot/797600238449590334)

**Tarkov Helper** is a Discord bot aimed at giving access to information in Escape From Tarkov in the easiest way

-   Tarkov Helper is using the new Discord Slash Command API so instead of using prefixs, just type / and a list of all valid commands will show. Click Here to see a more detailed explanation of all commands

-   Tarkov Helper is not associated with BattleState Games in any way. Any use of Logos refering to Escape From Tarkov or in-game assets are owned by [BattleState Games](https://www.battlestategames.com)

-   All content used from the Offical Escape from Tarkov Wiki is licensed under [CC BY-NC-SA 3.0](https://www.fandom.com/licensing)

# Adding the Bot

**Click the invite image to add the bot to your server**
<br>
[<img width="320" height="" align="left" style="float: left; margin: 0 10px 0 0;" alt="Tarkov Helper" src="https://raw.githubusercontent.com/Tarkov-Helper/Tarkov-Helper-Assets/main/Media/InviteBanner.png">](https://discord.com/api/oauth2/authorize?client_id=797600238449590334&permissions=128&scope=bot%20applications.commands)
<br><br><br><br><br>
[<img src="https://discordapp.com/api/guilds/797601083589001227/widget.png?style=banner2">](https://discord.gg/daTPNWes)
<br>
**You can also join the Tarkov Helper Discord Server to try out the bot**

# Building Yourself

Per the specifed [license](https://github.com/BetrixDev/Tarkov-Helper/blob/master/LICENSE), you are allowed to build and host Tarkov Helper on your own with some limitations, please read them before continuing. Also note, any form of self-hosting support will not be provided.

## **Requirements**

-   [A code editor](https://code.visualstudio.com/download)
-   [Git](https://git-scm.com/downloads)
-   [Node.js](https://nodejs.org/en/)

### **Downloading**

#### With [git](https://git-scm.com/downloads)

    git clone https://github.com/BetrixDev/Tarkov-Helper.git

#### Without [git](https://git-scm.com/downloads)

[Download source code](https://github.com/BetrixDev/Tarkov-Helper/archive/master.zip)

### **Setup**

Open the Tarkov-Helper directory and run configure.sh

    bash configure.sh

Enter your bot's token when prompted to. <br>
To configure a dev bot, open **config.json5** under `src/data/bot/config.json5`.

Run init.sh to automatically download all needed files

    bash init.sh

Run the bot using `npm start`. <br>
Or compile to the bot using `tsc` and use a [process manager](https://www.npmjs.com/package/pm2) to run the bot in production enviroments.
