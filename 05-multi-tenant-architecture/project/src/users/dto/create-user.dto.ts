import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'The role ID of the user' })
    @IsString()
    @IsNotEmpty()
    roleId!: string;
}