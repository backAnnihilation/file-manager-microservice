import { RoutingEnum } from '../../../../../libs/shared/routing';

export class ProfileRouting {
  constructor(private readonly baseUrl = RoutingEnum.users) {}
  updateProfile = () => `${this.baseUrl}/update`;
}
