/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest/presets/default',
    coveragePathIgnorePatterns: ['/node_modules/'],
    moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src'],
    testMatch: ['**/test/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)']
}
