rm src/data/game/temp/ -r -f
git clone https://github.com/Tarkov-Helper/Database src/data/game/temp
mv -v src/data/game/temp/* src/data/game/
rm src/data/game/temp/ -r -f