import { IsEmail, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class EditBookMarkDto {

    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    link?: string

}