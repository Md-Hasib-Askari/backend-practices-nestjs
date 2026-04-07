import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({ name: 'userId', example: '60d0fe4f5311236168a109ca' })
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ name: 'products', example: ['60d0fe4f5311236168a109cb', '60d0fe4f5311236168a109cc'] })
    @IsNotEmpty()
    products: string[];
}
