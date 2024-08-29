import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private readonly configService: ConfigService) {
        super({
        clientID: configService.get('GITHUB_CLIENT_ID'),
        clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
            callbackURL: 'http://localhost:3498/api/v1/auth/github/callback', 
            scope: ['user:email'],
            // scope: ['public_profile'],
            
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile,
        // done: (err: any, user: any, info?: any) => void,
        done: (...args: any[]) => void,
    ): Promise<any> {
        
        const { name, emails, photos } = profile;

        const user = {
            email: emails[0].value,      
            surname: name ? name.split(' ').slice(1).join(' ') : '',
            // name: name.givenName,
            name: name ? name.split(' ')[0] : '',
            // @ts-ignore
            // name: username,
            // surname: name ? name.split(' ').slice(1).join(' ') : '',
            avatar: photos[0].value,
            accessToken,
            refreshToken,
        };

        done(null, user);
        // done(null, profile);
    }
}
