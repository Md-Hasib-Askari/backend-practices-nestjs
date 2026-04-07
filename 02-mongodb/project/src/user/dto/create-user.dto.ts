import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator"

export class CreateUserDto {
    @ApiProperty({ name: 'email', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string


    @ApiProperty({ name: 'role', example: 'user' })
    @IsEnum(['user', 'admin'])
    role: string
}
