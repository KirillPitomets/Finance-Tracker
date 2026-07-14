import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RequestChangePasswordDto } from '../dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

export function ApiRequestChangePassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Request to change password',
      description:
        'Make request to change password for current user, and sent confirmation email',
    }),
    ApiBody({ type: RequestChangePasswordDto }),
    ApiResponse({
      status: HttpStatus.ACCEPTED,
      description: 'Confirmation email has been sent',
      type: SuccessResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Password do not match',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
    }),
    ApiBearerAuth(),
  );
}
