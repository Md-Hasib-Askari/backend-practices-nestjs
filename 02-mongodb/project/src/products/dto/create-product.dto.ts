import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ name: 'name', example: 'Laptop' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ name: 'price', example: 999.99 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ name: 'description', example: 'A high-performance laptop suitable for gaming and work.' })
    @IsString()
    description: string;
}
