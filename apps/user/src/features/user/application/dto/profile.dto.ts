import { convertTime } from '../../../../../core/utils/convert-string-to-date';
import { UpdateProfileInputModel } from '../../api/models/input/update-profile.model';

export class UserProfileDTO {
  readonly birthDate: string;
  readonly userName: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly country: string;
  readonly city: string;
  readonly about: string;
  readonly gender: string;
  readonly userId: string;

  constructor(
    profileDto: UpdateProfileInputModel & { userName: string; userId: string },
  ) {
    const {
      about,
      dateOfBirth,
      userName,
      firstName,
      lastName,
      city,
      country,
      gender,
      userId,
    } = profileDto;

    this.birthDate = convertTime(dateOfBirth);
    this.userName = userName;
    this.lastName = lastName;
    this.firstName = firstName;
    this.about = about;
    this.city = city;
    this.gender = gender;
    this.country = country;
    this.userId = userId;
  }
}
