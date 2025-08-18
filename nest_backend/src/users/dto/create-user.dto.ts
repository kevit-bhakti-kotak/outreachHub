import { IsEmail, IsNotEmpty, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @MinLength(6)
  password: string; // raw password, we’ll hash it in service

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
