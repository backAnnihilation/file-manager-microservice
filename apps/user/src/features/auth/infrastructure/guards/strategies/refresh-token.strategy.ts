import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { EnvironmentVariables } from '../../../../../../core/config/configuration';
import { SecurityQueryRepo } from '../../../../security/api/query-repositories/security.query.repo';
import { Request } from 'express';
import { StrategyType } from '../../../../../../core/infrastructure/guards/models/strategy.enum';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  StrategyType.RefreshToken,
) {
  constructor(
    private securityQueryRepo: SecurityQueryRepo,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    const { iat, deviceId } = payload;
    console.log({ iat, deviceId });

    const tokenIssuedAt = new Date(iat * 1000).toISOString();

    const userSession = await this.securityQueryRepo.getUserSession(deviceId);
    console.log({ userSession });

    if (!userSession || tokenIssuedAt !== userSession.lastActiveDate) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { ...payload };
  }
}
const cookieExtractor = (request: Request): string => {
  return request.cookies.refreshToken || request.headers.cookie?.split('=')[1];
};
