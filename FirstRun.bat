@ECHO OFF
ECHO --------------------------------------------
ECHO Downloading Dependencies
npm i
ECHO Finished Downloading Dependencies
ECHO Grabbing Data From APIs
node src/first.js
ECHO Finished Grabbing Data From APIs
ECHO Starting Tarkov Helper
node src/main.js
ECHO --------------------------------------------