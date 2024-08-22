import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { EnvironmentVariable } from '../../../../../../core/config/configuration';
import { BasicStrategy } from 'passport-http';

@Injectable()
export class BasicSAStrategy extends PassportStrategy(BasicStrategy) {
  constructor(private configService: ConfigService<EnvironmentVariable>) {
    super();
  }

  public validate = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    const { USERNAME, PASSWORD } = this.configService.get('basicAuth', {
      infer: true,
    });

    if (USERNAME === username && PASSWORD === password) {
      return true;
    }

    throw new UnauthorizedException();
  };
}
