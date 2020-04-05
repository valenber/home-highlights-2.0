module.exports = {
  moduleFileExtensions: ['js', 'jsx'],
  transform: { '\\.(js|jsx)': ['babel-jest'], '^.+\\.tsx?$': 'ts-jest' },
  testMatch: ['**/*.(test|spec).(js|jsx)'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
