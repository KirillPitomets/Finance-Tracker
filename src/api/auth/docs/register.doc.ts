import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { AuthEntity } from '../entities/auth.entity';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Creates a new user account and sets JWT token in HTTP-only cookie',
    }),
    ApiBody({ type: RegisterAuthDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User registered successfully, cookie set',
      type: AuthEntity,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation error - invalid email or password',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Conflict - email already exists',
    }),
  );
}
