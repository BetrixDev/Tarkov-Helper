echo Adding files
cd src/data
rm game/ -r -f
mkdir game
cd game/
mkdir api
cd api

# Create files and fill them with dummy text
touch itemdata.json
touch barterdata.json
touch questdata.json
touch bulletdata.json
curl https://gist.githubusercontent.com/BetrixDev/50a76834256a657567154b28cf427990/raw/9367f09dbd0b5cd06c613639b979d0868fd70137/item.json > itemdata.json
curl https://gist.githubusercontent.com/BetrixDev/f1de51cf80f8817b0ae6c6726eacfdd2/raw/0a7b81fdce8d45256a0dca5bd35d40dba09d6455/barter.json > barterdata.json
curl https://gist.githubusercontent.com/BetrixDev/49d4ff375890256aa2a2fb69c927d8cd/raw/c80d61be18e5898ee328c90fd7e2023e715eb297/quest.json > questdata.json
curl https://raw.githack.com/TarkovTracker/tarkovdata/master/ammunition.json > bulletdata.json

echo Grabbing database
cd ../../../../
bash database.sh

echo Installing node modules
npm i

echo Grabbing data from Apis
npm run init