module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: { '\\.(js|jsx|ts|tsx)': ['babel-jest'] },
  testMatch: ['**/*.(test|spec).(js|jsx|ts|tsx)'],
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['text'],
  setupFilesAfterEnv: ['./tests/utils/bootstrapTestingEnvironment.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/fileMock.js',
    'services/(.*)': '<rootDir>/services/$1',
  },
};
