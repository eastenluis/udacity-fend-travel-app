module.exports = {
    projects: [{
        clearMocks: true,
        moduleDirectories: [
            'node_modules',
        ],
        rootDir: './src/server',
        setupFiles: ['<rootDir>/setupTest.js'],
        testEnvironment: 'node',
        testRegex: '^.+\\.test\\.js$',
        verbose: false,
    }, {
        clearMocks: true,
        moduleDirectories: [
            'node_modules',
        ],
        modulePaths: ['<rootDir>'],
        rootDir: './src/client',
        setupFiles: ['<rootDir>/setupTest.js'],
        testEnvironment: 'jsdom',
        testRegex: '^.+\\.test\\.js$',
        timers: 'real',
        transform: {
            '^.+\\.jsx?$': 'babel-jest',
        },
        transformIgnorePatterns: [
            'node_modules/',
        ],
        verbose: false,
    }],
};
