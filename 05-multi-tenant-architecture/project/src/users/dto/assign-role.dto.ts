import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AssignRoleDto {
    @ApiProperty({ example: 'editor' })
    @IsString()
    @IsNotEmpty()
    role!: string;
}
