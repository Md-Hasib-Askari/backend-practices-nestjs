import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'editor' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: ['posts:create', 'posts:update'] })
    @IsArray()
    @IsString({ each: true })
    permissions!: string[];
}
