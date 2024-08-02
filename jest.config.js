module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
};
