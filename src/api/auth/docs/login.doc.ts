import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { AuthEntity } from '../entities/auth.entity';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login user',
      description:
        'Authenticate user by email and password. Sets JWT access and refresh tokens in HTTP-only cookies.',
    }),
    ApiBody({ type: LoginAuthDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Login successfully, cookie set',
      type: AuthEntity,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid email or password',
    }),
  );
}
