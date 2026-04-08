import { Type } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

const UpdateUserDtoBase: Type<Partial<CreateUserDto>> = PartialType(CreateUserDto);

export class UpdateUserDto extends UpdateUserDtoBase { }
