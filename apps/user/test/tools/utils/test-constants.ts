import { v4 as uuidv4 } from 'uuid';

export const constantsTesting = {
  inputData: {
    length01: '01',
    length02: '02',
    length05: 'len05',
    length16: 'length16_-234567',
    length19: 'length19_-234567891',
    length21: 'length21_-23456789101',
    length31: 'length_31-SADDJKCJKSDWKLKASDLKQ',
    length101:
      'length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx',
    length301: 'length_301-' + 'x'.repeat(290),
    length501: 'length_501-' + 'x'.repeat(490),
    length1001: 'length_1001-' + 'x'.repeat(989),
    expiredAccessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWIxMDg5MGQzODQ5NjVkZTAwNzA0N2EiLCJkZXZpY2VJZCI6ImEzOTBkMDcwLTJmYmItNDA2OC04NzkxLTMzZDllMTM4MmIzNSIsImlhdCI6MTcwNjEwMDk2NywiZXhwIjoxNzA2MTA4MTY3fQ.kogQ9UmVq8o4_y86jgypss0Et1pLY5oMIKEDEY7kGlE',
    validUUID: uuidv4(),
    EMAIL: 'test@gmail.com',
    EMAIL2: 'test@yandex.ru',
    EMAIL3: 'test@k.io',
    INVALID_EMAIL: 'invalid-email',
    USER_NAME: 'Pythagoras',
    USER_NAME2: 'Protagoras',
    USER_NAME3: 'Socrates',
    USER_NAME4: 'Aristotle',
    PASSWORD: 'securePassword',
    VALID_PASSWORD: 'validPassword0!',
    city: 'Rome',
    country: 'Italy',
    about:
      'My interests include science and science-based tools for everyday life',
  },
  auth: {
    authBearer: { type: 'bearer' } as { type: 'bearer' },
    authBasic: { type: 'basic' } as { type: 'basic' },
    basicUser: 'admin',
    basicPass: 'qwerty',
  },
};

export type ConstantsTestType = keyof typeof constantsTesting;
export type InputConstantsType = typeof constantsTesting.inputData;
export type AuthConstantsType = typeof constantsTesting.auth;
export const feedbacksConstants = {
  createdContent: [
    'content include discussion about nature',
    'content include discussion about freedom',
    'content include discussion about environment',
    'content include discussion about neuroscience',
    'content include discussion about neurobiology',
  ],
};

export const mockImage: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'example.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: 1234,
  destination: './uploads/',
  filename: 'example-1234.png',
  path: './uploads/example-1234.png',
  buffer: Buffer.alloc(1234),
  stream: null,
};
