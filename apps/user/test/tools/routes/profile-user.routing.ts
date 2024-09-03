import { RoutingEnum } from '../../../../../libs/shared/routing';

export class ProfileRouting {
  constructor(private readonly baseUrl = RoutingEnum.users) {}
  fillOutProfile = () => `${this.baseUrl}/create`;
  editProfile = () => `${this.baseUrl}/edit`;
}
