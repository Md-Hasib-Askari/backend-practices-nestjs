import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTenantDto {
    @ApiProperty({ example: 'Acme Corporation', description: 'The name of the tenant' })
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'acme-corp', description: 'A unique slug for the tenant' })
    @IsNotEmpty()
    slug!: string;

    @ApiProperty({ example: true, description: 'Whether the tenant is active' })
    isActive?: boolean;

    @ApiProperty({ example: 'A description of the tenant', description: 'Optional description' })
    description?: string;
}
