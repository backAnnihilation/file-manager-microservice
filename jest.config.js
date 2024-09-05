module.exports = {
  projects: [
    '<rootDir>/apps/fileHub/test/jest-e2e.json',
    '<rootDir>/apps/user/test/jest-e2e.json',
  ],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/libs/shared/$1',
    '^@user/core/(.*)$': '<rootDir>/apps/user/src/core/$1',
  },
};
