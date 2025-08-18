import { Body, Controller, Post, Get, Param, HttpException, Patch, Delete} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

   @Get()
    getUsers(){
        return this.usersService.getUsers();
    }

     @Get(':id')
    async getUserById(@Param('id') id: string){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('user not found',404);
        const findUser = await this.usersService.getUsersById(id);
        if(!findUser) throw new HttpException('user not found',404);
        return findUser;
    }

    @Patch(':id')
async updateUser(@Param('id')id:string,@Body()updateUserDto:UpdateUserDto){
    const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('invalid id',400);
        const updatedUser = await this.usersService.updateUser(id, updateUserDto);
        if(!updatedUser)throw new HttpException('User Not Found', 404);
        return updatedUser;
}

@Delete(':id')
async deleteUser(@Param('id') id:string){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('user not found',404);
        const deletedUser = await this.usersService.deleteUser(id);
        if(!deletedUser) throw new HttpException('user not found', 404);
        return;
}
}