import { UserProfile, UserProfileSchema } from './domain/user-profile.schema';

export const schemas = [
  {
    name: UserProfile.name,
    schema: UserProfileSchema,
  },
];
