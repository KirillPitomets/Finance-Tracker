import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({
    example: 'Confirmation email has been sent.',
  })
  message: string;
}
