rm data/game/temp/ -r -f
git clone https://github.com/Tarkov-Helper/Database data/game/temp
mv -v data/game/temp/* data/game/
rm data/game/temp/ -r -f