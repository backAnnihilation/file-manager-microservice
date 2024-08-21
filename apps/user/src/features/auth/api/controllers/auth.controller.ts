import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
// import { Response } from 'express';
import { ClientInfo } from '../models/auth-input.models.ts/client-info.type';
import { UserCredentialsWithCaptureTokenDto } from '../models/auth-input.models.ts/verify-credentials.model';
import { RoutingEnum } from '../../../../../core/routes/routing';
import { LocalAuthGuard } from '../../infrastructure/guards/local-auth.guard';
import { CustomThrottlerGuard } from '../../../../../core/infrastructure/guards/custom-throttler.guard';
import { AuthNavigate } from '../../../../../core/routes/auth-navigate';
import {
  RefreshTokenEndpoint,
  SignInEndpoint,
} from '../../dto/documentation/signIn/signIn-description';
import { CommandBus } from '@nestjs/cqrs';
import { AuthService } from '../../application/auth.service';
import { ConfirmEmailCommand } from '../../application/use-cases/commands/confirm-email.command';
import { CreateTemporaryAccountCommand } from '../../application/use-cases/commands/create-temp-account.command';
import { CreateUserCommand } from '../../application/use-cases/commands/create-user.command';
import { PasswordRecoveryCommand } from '../../application/use-cases/commands/recovery-password.command';
import { UpdateConfirmationCodeCommand } from '../../application/use-cases/commands/update-confirmation-code.command';
import { UpdateIssuedTokenCommand } from '../../application/use-cases/commands/update-Issued-token.command';
import { UpdatePassTempAccountCommand } from '../../application/use-cases/commands/update-password-temporary-account.command';
import { UpdatePasswordCommand } from '../../application/use-cases/commands/update-password.command';
import { GetClientInfo } from '../../infrastructure/decorators/client-ip.decorator';
import { UserPayload } from '../../infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../infrastructure/guards/accessToken.guard';
import { RefreshTokenGuard } from '../../infrastructure/guards/refreshToken.guard';
import { RegistrationEmailDto } from '../models/auth-input.models.ts/password-recovery.types';
import { RecoveryPassDto } from '../models/auth-input.models.ts/recovery.model';
import { RegistrationCodeDto } from '../models/auth-input.models.ts/registration-code.model';
import { CreateUserDto } from '../models/auth-input.models.ts/user-registration.model';
import { UserProfileType } from '../models/auth.output.models/auth.output.models';
import { AuthQueryRepository } from '../query-repositories/auth.query.repo';
import { UserSessionDto } from '../../../security/api/models/security-input.models/security-session-info.model';
import { CreateSessionCommand } from '../../../security/application/use-cases/commands/create-session.command';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';
import { OutputId } from '../../../../../core/api/dto/output-id.dto';
import { handleErrors } from '../../../../../core/utils/handle-response-errors';
import { extractDeviceInfo } from '../../infrastructure/utils/device-info-extractor';
import { DeleteActiveSessionCommand } from '../../../security/application/use-cases/commands/delete-active-session.command';

@Controller(RoutingEnum.auth)
export class AuthController {
  constructor(
    private authQueryRepo: AuthQueryRepository,
    private authService: AuthService,
    private commandBus: CommandBus,
    // private readonly blogsCrudApiService: BlogsCUDApiService,
  ) {}

  // todo authCUDService
  @SignInEndpoint()
  @UseGuards(CustomThrottlerGuard, LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthNavigate.Login)
  async singIn(
    @UserPayload() userInfo: UserSessionDto,
    @GetClientInfo() clientInfo: ClientInfo,
    @Res({ passthrough: true }) res: any,
    @Body() body: UserCredentialsWithCaptureTokenDto,
  ) {
    const isValid = this.authService.validateCaptureToken(body.recaptureToken);
    if (!isValid) throw new BadRequestException('Invalid recapture token');

    const { accessToken, refreshToken } =
      await this.authService.createTokenPair(userInfo.userId);

    const userPayload = this.authService.getUserPayloadByToken(refreshToken);

    if (!userPayload) throw new Error();

    const { browser, deviceType } = extractDeviceInfo(clientInfo.userAgentInfo);

    const command = new CreateSessionCommand({
      userPayload,
      browser,
      deviceType,
      ipAddress: clientInfo.ip,
      userId: userInfo.userId,
      refreshToken,
    });

    const result = await this.commandBus.execute<
      CreateSessionCommand,
      LayerNoticeInterceptor<OutputId>
    >(command);

    if (result.hasError) {
      const errors = handleErrors(result.code, result.extensions[0]);
      throw errors.error;
    }

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @RefreshTokenEndpoint()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthNavigate.RefreshToken)
  async refreshToken(
    @UserPayload() userInfo: UserSessionDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const { userId, deviceId } = userInfo;

    const { accessToken, refreshToken } =
      await this.authService.updateUserTokens(userId, deviceId);

    const userInfoAfterRefresh =
      this.authService.getUserPayloadByToken(refreshToken);

    const issuedAt = new Date(userInfoAfterRefresh!.iat * 1000);
    const expirationDate = new Date(userInfoAfterRefresh!.exp * 1000);

    const command = new UpdateIssuedTokenCommand({
      deviceId,
      issuedAt,
      expirationDate,
    });

    await this.commandBus.execute<UpdateIssuedTokenCommand, boolean>(command);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
  }

  @UseGuards(CustomThrottlerGuard)
  @Post(AuthNavigate.NewPassword)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordRecovery(@Body() data: RecoveryPassDto) {
    const existingAccount =
      await this.authQueryRepo.findUserAccountByRecoveryCode(data.recoveryCode);

    if (existingAccount) {
      const command = new UpdatePasswordCommand(data);

      return this.commandBus.execute<UpdatePasswordCommand, boolean>(command);
    }

    const command = new UpdatePassTempAccountCommand(data);

    return this.commandBus.execute(command);
  }

  @UseGuards(CustomThrottlerGuard)
  @Post(AuthNavigate.PasswordRecovery)
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoveryPassword(@Body() data: RegistrationEmailDto) {
    const userAccount = await this.authQueryRepo.findByLoginOrEmail(data);

    if (!userAccount) {
      const command = new CreateTemporaryAccountCommand(data);

      return await this.commandBus.execute<
        CreateTemporaryAccountCommand,
        OutputId
      >(command);
    }

    const command = new PasswordRecoveryCommand(data);

    await this.commandBus.execute<PasswordRecoveryCommand, boolean>(command);
  }

  @Post(AuthNavigate.Registration)
  @UseGuards(CustomThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userName, email } = data;

    // const foundUser = await this.authQueryRepo.findByLoginOrEmail({
    //   login,
    //   email,
    // });

    // if (foundUser) {
    //   let errors: ErrorType;

    //   if (foundUser.accountData.email === email) {
    //     errors = makeErrorsMessages('email');
    //   }

    //   if (foundUser.accountData.login === login) {
    //     errors = makeErrorsMessages('login');
    //   }

    //   res.status(HttpStatus.BAD_REQUEST).send(errors!);
    //   return;
    // }

    const command = new CreateUserCommand(data);

    const resultNotification = await this.commandBus.execute(command);
    return resultNotification.data;
  }

  @UseGuards(CustomThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(AuthNavigate.RegistrationConfirmation)
  async registrationConfirmation(
    @Body() data: RegistrationCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new ConfirmEmailCommand(data);

    const confirmedUser = await this.commandBus.execute<
      ConfirmEmailCommand,
      boolean
    >(command);

    // if (!confirmedUser) {
    //   const errors = makeErrorsMessages('code');
    //   res.status(HttpStatus.BAD_REQUEST).send(errors);
    // }
  }

  @UseGuards(CustomThrottlerGuard)
  @Post(AuthNavigate.RegistrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() data: RegistrationEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAccount = await this.authQueryRepo.findByLoginOrEmail(data);

    // if (
    //   !userAccount ||
    //   userAccount.emailConfirmation.isConfirmed ||
    //   new Date(userAccount.emailConfirmation.expirationDate) < new Date()
    // ) {
    //   const errors = makeErrorsMessages('confirmation');
    //   res.status(HttpStatus.BAD_REQUEST).send(errors);
    //   return;
    // }

    const command = new UpdateConfirmationCodeCommand(data);

    await this.commandBus.execute(command);
  }

  @UseGuards(AccessTokenGuard)
  @Get(AuthNavigate.GetProfile)
  async getProfile(
    @UserPayload() userInfo: UserSessionDto,
  ): Promise<UserProfileType> {
    const user = await this.authQueryRepo.getUserById(userInfo.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { email, login, id: userId } = user.accountData;

    return { email, login, userId };
  }

  @UseGuards(RefreshTokenGuard)
  @Post(AuthNavigate.Logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@UserPayload() userInfo: UserSessionDto) {
    const command = new DeleteActiveSessionCommand(userInfo);
    await this.commandBus.execute(command);
  }
}
