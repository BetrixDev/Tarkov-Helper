/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    verbose: true,
    coveragePathIgnorePatterns: ['/node_modules/'],
    moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src']
}
