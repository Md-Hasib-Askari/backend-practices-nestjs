import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class RegisterResponseDto {
  @ApiProperty({ example: '67f4e9f0a8d74b001f2ec1aa' })
  @Expose()
  @Transform(({ obj }) => (obj.id ? obj.id : String(obj._id)))
  id!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Expose()
  email!: string;

  @Exclude()
  password!: string;
}