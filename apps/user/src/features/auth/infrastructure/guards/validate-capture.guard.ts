import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CaptureAdapter } from '@user/core/adapters/capture.adapter';

@Injectable()
export class CaptureGuard implements CanActivate {
  constructor(private captureAdapter: CaptureAdapter) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const captchaToken = request.header['captchaToken'];

    if (captchaToken) {
      const validCapture =
        await this.captureAdapter.validateCaptureToken(captchaToken);

      if (!validCapture) return false;
    }

    return true;
  }
}
