import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({ description: 'The name of the product' })
    name!: string;

    @ApiProperty({ description: 'The price of the product' })
    price!: number;
}
