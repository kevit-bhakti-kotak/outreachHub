import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, phoneNumber, password, isAdmin } = createUserDto;

    // check if email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      phoneNumber,
      passwordHash,
      isAdmin: isAdmin || false,
      workspaces: createUserDto.workspaces
    });

    return (await newUser.save());
  }

getUsers(){
    return this.userModel.find();
  }

getUsersById(id: string){
    return this.userModel.findById(id).populate('workspaces.workspaceId', 'name');
  }
 updateUser(id: string, updateUserDto: UpdateUserDto) {
  if (updateUserDto.workspaces) {
    return this.userModel.findByIdAndUpdate(
      id,
      { $addToSet: { workspaces: { $each: updateUserDto.workspaces } } },
      { new: true }
    );
  }

  // fallback for normal updates (name, email, etc.)
  return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
}

deleteUser(id: string){
        return this.userModel.findByIdAndDelete(id);
     }

}
