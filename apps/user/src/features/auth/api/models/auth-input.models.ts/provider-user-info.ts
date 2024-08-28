import { Provider } from '@prisma/client';

interface IBaseUserProvider {
  providerId: string;
  provider: Provider;
}

export interface IGoogleUserInput extends IBaseUserProvider {
  email: string;
  userName: string;
  avatar?: string;
}

export interface IGithubUserInput extends IBaseUserProvider {
  email?: string;
  userName?: string;
}
