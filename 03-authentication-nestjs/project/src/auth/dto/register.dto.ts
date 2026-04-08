import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Min } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @Min(6)
    password!: string;
}