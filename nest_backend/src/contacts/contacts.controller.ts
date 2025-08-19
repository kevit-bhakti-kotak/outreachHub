import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  HttpException,
  Patch,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './schemas/contact.schema';
import mongoose from 'mongoose';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() createContactsDto: CreateContactDto, @Req() req: any):Promise<Contact> {
    return this.contactsService.create(createContactsDto, req.user.userId);
  }

  @Get()
  async findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
            if(!isValid) throw new HttpException('user not found',404);
            const findUser = await this.contactsService.findOne(id);
            if(!findUser) throw new HttpException('user not found',404);
            return findUser;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
     const isValid = mongoose.Types.ObjectId.isValid(id);
            if(!isValid) throw new HttpException('invalid id',400);
            const updatedUser = await this.contactsService.update(id, updateContactDto);
            if(!updatedUser)throw new HttpException('User Not Found', 404);
            return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
            if(!isValid) throw new HttpException('user not found',404);
            const deletedUser = await this.contactsService.remove(id);
            if(!deletedUser) throw new HttpException('user not found', 404);
            return;
  }
}
