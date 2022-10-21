// eslint-disable-next-line strict
module.exports = {
    roots: ['<rootDir>/tests'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: [
        '/node_modules/'
    ],
    verbose: true
};
