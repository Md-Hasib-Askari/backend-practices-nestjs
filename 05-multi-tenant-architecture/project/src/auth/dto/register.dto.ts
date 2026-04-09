import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'The role ID of the user' })
    @IsString()
    @IsNotEmpty()
    roleId!: string;
}
