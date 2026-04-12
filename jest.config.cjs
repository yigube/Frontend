module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: ['<rootDir>/src/**/*.test.js'],
  clearMocks: true
};
