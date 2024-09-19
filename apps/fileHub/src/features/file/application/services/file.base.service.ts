import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { PostsApiService } from './posts-api.service';
import { ProfilesApiService } from './profiles-api.service';

@Injectable()
export class FilesApiService {
  constructor(
    private readonly profileApiService: ProfilesApiService,
    private readonly postsApiService: PostsApiService,
  ) {}

  uploadImage(command: any, context: RmqContext, service: Service) {
    switch (service) {
      case Service.PROFILE:
        return this.profileApiService.handleEvent(command, context);
      case Service.POST:
        return this.postsApiService.handleEvent(command, context);
    }
  }
}

export enum Service {
  PROFILE = 'PROFILE',
  POST = 'POST',
}
