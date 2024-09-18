import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CaptureAdapter } from '@user/core/adapters/capture.adapter';

@Injectable()
export class CaptureGuard implements CanActivate {
  constructor(private captureAdapter: CaptureAdapter) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const captchaToken = request.headers['captchatoken'];

    return this.captureAdapter.isValidCaptchaToken(captchaToken);
  }
}
