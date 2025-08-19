import { IsNotEmpty, IsString } from "class-validator";

export class loginDto{
    @IsString()
    @IsNotEmpty()
    emain: string;
     @IsString()
    @IsNotEmpty()
    password:string;
}