import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { RoutingEnum } from '../../../../../core/routes/routing';
import { PaginationViewModel } from '../../../../../core/utils/sorting-base-filter';
import { BasicSAAuthGuard } from '../../../auth/infrastructure/guards/basic-auth.guard';
import { CreateSACommand } from '../../application/commands/create-sa.command';
import { DeleteSACommand } from '../../application/commands/delete-sa.command';
import { SACudApiService } from '../../application/sa-cud-api.service';
import { CreateUserDto } from '../models/input-sa.dtos.ts/create-user.model';
import { SAQueryFilter } from '../models/outputSA.models.ts/query-filters';
import { SAViewType } from '../models/user.view.models/userAdmin.view-type';
import { UsersQueryRepo } from '../query-repositories/users.query.repo';

@UseGuards(BasicSAAuthGuard)
@Controller(RoutingEnum.admins)
export class SAController {
  constructor(
    private usersQueryRepo: UsersQueryRepo,
    private saCrudApiService: SACudApiService<
      CreateSACommand | DeleteSACommand
    >,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query() query: SAQueryFilter,
  ): Promise<PaginationViewModel<SAViewType>> {
    return this.usersQueryRepo.getAllUsers(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSA(@Body() body: CreateUserDto): Promise<SAViewType> {
    const createCommand = new CreateSACommand(body);
    return this.saCrudApiService.create(createCommand);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSA(@Param('id') userId: string): Promise<void> {
    const command = new DeleteSACommand(userId);
    return this.saCrudApiService.updateOrDelete(command);
  }
}
