import { RoutingEnum } from '../../../core/routes/routing';

export class SecurityRouting {
  constructor(private readonly baseUrl = RoutingEnum.security) {}
  getUserSessions = () => this.baseUrl;
  removeOtherSessions = () => this.baseUrl;
  removeSession = (deviceId: string) => `${this.baseUrl}/${deviceId}`;
}
