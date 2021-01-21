![TarkovHelperBanner](https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Banner3000x1000.png?token=AMYPLRDPOYU7KCU3PFKQI3C77JL3W)

# Description (This Project Is Not Yet Finished)
**Tarkov Helper** is a Discord bot aimed to give users all kinds of information in an easy and read and use format. <br /> <br />
 - Since most players use Discord as a way to communicate, having a discord bot to access information within the game will help with having to not open a browser and searching which will take more resources and time with the potential of lag in-game instead, now by typing in a command in a Discord server/channel, a simple alt-tab to an already open program will be much more efficient. Aswell as having extra useful features such as a **Bitcoin Farm Calculator**
 
 - Tarkov Helper is not affiliated with BattleState Games in any way 
 
 # Commands - More Coming Soon!
 **The commmands for the bot include [Refer here to see responses](https://github.com/BetrixEdits/Tarkov-Helper/tree/master/Assets/Reponses)**
 **Most commands feature a shorter "alias" command aswell**
 #### !bitcoinfarm *{GPUS}* - **short:** !bf *{GPUS}* - **ex:** !bitcoinfarm 50
 - Returns the amount of Bitcoins and Roubles made per day from the amount of GPUS selected
 #### !bitcoinfarm compare *{GPUS1} {GPUS2}* - **short:** !bf c *{GPUS} {GPUS2}* - **ex:** !bitcoinfarm compare 1 10
 - Compares the amount of Bitcoin and Roubles made per day between two different configurations of GPUS
 #### !map *{MAP} {SPECIFIC MAP}* - **short:** !m  {MAP} {SPECIFIC MAP} - **ex:** !map customs spawns
 - Returns an image of the map specified
 #### !price *{ITEM}* - Coming Soon
 - Returns the current price of the selected item on the flea market
 #### !xpto *{LVL} {CURRENT LVL}* - **short:** !xp *{LVL} {CURRENT LVL}* - **ex:** !xpto 40 30
 - Returns the amount of Experience needed to go from the Current Level to the Selected Level. Can also use Current Experience to Selected Level for more a accurate calculation
 #### !quest *{QUEST NAME}* - **short:** !q *{QUEST NAME}* - **ex:** !quest Debut
 - Return information about the inputted quest
 
 ## Stat Commands
 #### !stats *{ITEM_NAME}* - Coming Soon
 - Returns important values of the item specified
 
 ## Admin Commands
 #### !prefixset *{PREFIX}* - **ex:** !prefixset #
 - Customize the prefix that the bot will respond to in order to help with conflicting commands and other bots or just preference

# Deployment
[**Click Here**](https://discord.com/oauth2/authorize?client_id=797600238449590334&scope=bot&permissions=511040) then **select a server** and hit **continue** to be able to add Tarkov Helper to your server.
![TarkovHelperBanner](https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Media/DiscordBotConnection.png?raw=true)

# Building Yourself

**Requirements**
- [A code editor](https://code.visualstudio.com/download)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/) 
- Discord.js: ```npm install discord.js```
- Axios: ```npm install axios```
- Dotenv: ```npm install dotenv```

**Setup**
- Open CMD and type: ```cd DIRECTORY_OF_PROJECT``` ex: "cd Desktop/Discordbot"
- Then type: ```npm init```
- Follow setup in CMD and there should be a ```package.json``` file in the directory now
- Type in CMD: ```npm install PACKAGE_NAME``` to install the three above mentioned packages needed to run this application
- Download this repository by typing in CMD ```git clone https://github.com/BetrixEdits/Tarkov-Helper.git``` or use any other way provided by GitHub
