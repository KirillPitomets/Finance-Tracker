import { IntersectionType, PickType } from '@nestjs/swagger';
import { RegisterAuthDto } from 'src/api/auth/dto';
import { CreateUserDto } from '../../dto';

export class RequestChangeEmailDto extends IntersectionType(
  PickType(CreateUserDto, ['email']),
  PickType(RegisterAuthDto, ['password']),
) {}
