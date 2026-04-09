import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: 'My First Post' })
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: 'This is the content of my first post.' })
    @IsNotEmpty()
    content!: string;
}
