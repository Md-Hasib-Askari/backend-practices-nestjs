import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, Min } from "class-validator";
import { Role } from "../../auth/enums/roles.enum";

export class CreateUserDto {
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @Min(6)
    password!: string;

    @ApiProperty({ example: ['user'] })
    @IsEnum(Role, { each: true })
    roles?: string[];
}
