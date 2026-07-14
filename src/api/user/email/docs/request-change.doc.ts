import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RequestChangeEmailDto } from '../dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

export function ApiRequestChange() {
  return applyDecorators(
    ApiOperation({
      summary: 'Request to change current email',
      description:
        'Make request to change current email for user, and sent confirmation mail',
    }),
    ApiBody({ type: RequestChangeEmailDto }),
    ApiResponse({
      status: HttpStatus.ACCEPTED,
      description: 'Confirmation email has been sent.',
      type: SuccessResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User with that email already registered',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Password is incorrect',
    }),
    ApiBearerAuth(),
  );
}
