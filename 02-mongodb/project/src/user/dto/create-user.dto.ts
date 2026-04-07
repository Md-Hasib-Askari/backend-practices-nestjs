import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty({ name: 'email', example: 'john.doe@example.com' })
    email: string

    @ApiProperty({ name: 'role', example: 'user' })
    role: string
}
