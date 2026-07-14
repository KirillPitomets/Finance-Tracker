import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Authorization } from 'src/common/decorators/Authorization.decorator';
import { Authorized } from 'src/common/decorators/Authorized.decorator';

import { ApiTags } from '@nestjs/swagger';
import { ApiGetUserByEmail, ApiGetUserById, ApiUpdateUserName } from './docs';
import { UserService } from './user.service';
import { UpdateUsernameDto } from './dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @ApiGetUserByEmail()
  @Get('search')
  async getUserByEmail(@Query('email') email: string): Promise<UserEntity> {
    return await this.userService.findByEmailOrThrow(email);
  }

  @ApiGetUserById()
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findByIdOrThrow(id);
  }

  @ApiUpdateUserName()
  @Authorization()
  @Patch('name')
  async updateUsername(
    @Authorized('id') id: string,
    @Body() dto: UpdateUsernameDto,
  ): Promise<UserEntity> {
    return await this.userService.updateUsername(id, dto);
  }
}
