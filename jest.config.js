module.exports = {
  projects: [
    // '<rootDir>/apps/fileHub/test/jest-e2e.json',
    '<rootDir>/apps/user/test/jest-e2e.json',
    '<rootDir>/apps/user/jest-unit.json',
  ],
  moduleNameMapper: {
    '^@app/shared/(.*)$': '<rootDir>/libs/shared/src/$1',
    '^@app/utils/(.*)$': '<rootDir>/libs/shared/utils/$1',
    '^@user/core/(.*)$': '<rootDir>/apps/user/src/core/$1',
    '^@file/core/(.*)$': '<rootDir>/file Hub/src/core/$1',
  },
};
