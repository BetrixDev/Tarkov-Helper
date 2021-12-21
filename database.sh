#!/bin/bash

if [ -d "game_data/" ]; then
    cd game_data/
    git pull
else
    git clone https://github.com/Tarkov-Helper/Database game_data
fi
