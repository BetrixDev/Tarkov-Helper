# Changelog

- Added support for different languages `./localizations.json`
- Reworked how data is handled within the appliation (for the 100th time)
- `ServerData` is now injected into methods with the @Slash decorator
- Added very simple tests
- Game stats now uses a much simpler method for obtaining all relevant stats of an item
- Added logging of bot events
- Ditched `config.json` for standar enviroment variables to make deploying easier
- All related game types now live in `./src/data/types.ts` as oppose to many global declartion files
- Made casing more consistent

_this branch is still in very early development, not all features are present and is not production ready_