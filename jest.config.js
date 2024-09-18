module.exports = {
  projects: [
    // '<rootDir>/apps/fileHub/test/jest-e2e.json',
    '<rootDir>/apps/user/test/jest-e2e.json',
    '<rootDir>/apps/user/jest-unit.json',
  ],
  moduleNameMapper: {
    '^@app/shared/(.*)$': '<rootDir>/libs/shared/src/$1',
    '^@models/(.*)$': '<rootDir>/libs/shared/models/$1',
    '^@config/(.*)$': '<rootDir>/libs/shared/config/$1',
    '^@user/core/(.*)$': '<rootDir>/apps/user/src/core/$1',
    '^@file/core/(.*)$': '<rootDir>/apps/fileHub/src/core/$1',
  },
};
