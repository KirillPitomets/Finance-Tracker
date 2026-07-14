import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUsernameDto extends PickType(CreateUserDto, ['name']) {}
export class UpdateUserEmailDto extends PickType(CreateUserDto, ['email']) {}
