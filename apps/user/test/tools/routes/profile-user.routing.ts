import { RoutingEnum } from '@shared/routing';

import { UserNavigate } from '../../../src/core/routes/user-navigate';

import { BaseRouting } from './base-api.routing';

export class ProfileRouting extends BaseRouting {
  constructor() {
    super(RoutingEnum.profiles);
  }
  fillOutProfile = () => `${this.baseUrl}/${UserNavigate.FillOutProfile}`;
  editProfile = () => `${this.baseUrl}/${UserNavigate.EditProfile}`;
  getProfile = () => `${this.baseUrl}/${UserNavigate.GetProfile}`;
  uploadPhoto = () => `${this.baseUrl}/${UserNavigate.UploadPhoto}`;
}
