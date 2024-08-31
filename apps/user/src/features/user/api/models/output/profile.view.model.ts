import { UserProfile } from '@prisma/client';

export const getUserProfileViewModel = (
  profile: UserProfile & { userAccount: { userName: string } },
): UserProfileViewModel => ({
  id: profile.id,
  userName: profile?.userAccount?.userName,
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export type UserProfileViewModel = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
};
