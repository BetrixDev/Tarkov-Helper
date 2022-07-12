# Tarkov Helper Rewrite

### Changes

This file isn't complete, nor is the rewrite

tldr: the bot does the same things, just gets there a little differently

- Removed MongoDB integration
    - With the recent updates Discord has pushed out, all configuration that was available for the bot is now able to be
      accessed within the client
- Change game data collection layer
    - Data collection now takes place within service classes to take further advantage of the [IOC](https://discord-ts.js.org/docs/general/dependencyInjection)
      paradigm [discordx](https://www.npmjs.com/package/discordx) supports
    - All data is now stored and cached in memory at all times
- Any class and/or function directly coupled with the discordx library now sits inside the `discord` directory
    - `discord/`
        - `commands/`
        - `events/`
        - `guards/`
- Adjusted formatting rules
- Implement [eslint](https://www.npmjs.com/package/eslint)
- File naming and casing now represents what is exported within the module
- Fix typos in strings
- Translation Changes
  - Add support for the slash command localization that is starting to be supporting by the libraries being used
