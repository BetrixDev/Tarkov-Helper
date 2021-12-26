#!/bin/bash

if ! [ -f "config.json" ]; then
    curl https://gist.githubusercontent.com/BetrixDev/ac0eb364ee1eb051f232e5b3655958f8/raw/d1427f174cd3769a9533ba6c7b03a60208739c39/config.json >config.json
fi

if [ -d "game_data/" ]; then
    cd game_data
    mkdir api
    mkdir pricehistory
    cd api

    curl https://gist.githubusercontent.com/BetrixDev/50a76834256a657567154b28cf427990/raw/9367f09dbd0b5cd06c613639b979d0868fd70137/item.json >itemdata.json
    curl https://gist.githubusercontent.com/BetrixDev/f1de51cf80f8817b0ae6c6726eacfdd2/raw/0a7b81fdce8d45256a0dca5bd35d40dba09d6455/barter.json >barterdata.json
    curl https://gist.githubusercontent.com/BetrixDev/49d4ff375890256aa2a2fb69c927d8cd/raw/c80d61be18e5898ee328c90fd7e2023e715eb297/quest.json >questdata.json
    curl https://raw.githack.com/TarkovTracker/tarkovdata/master/ammunition.json >bulletdata.json

    npm i pm2
    npm i

    npm run init
else
    bash database.sh && bash init.sh
fi