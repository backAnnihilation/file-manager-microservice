import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { EnvironmentVariables } from '../../../../../../core/config/configuration';
import { StrategyType } from '../../../../../../core/infrastructure/guards/models/strategy.enum';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(
  Strategy,
  StrategyType.Github
) {
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    super({
      clientID: configService.get('OAUTH_GITHUB_CLIENT_ID'),
      clientSecret: configService.get('OAUTH_GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get('OAUTH_GITHUB_REDIRECT_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile
  ) {
    const { id: providerId, emails, displayName, photos, provider } = profile;
    
    const user = {
      providerId,
      userName: displayName,
      email: emails[0].value,
      provider: provider,
      displayName: displayName,
    };

    return user;
  }
}
