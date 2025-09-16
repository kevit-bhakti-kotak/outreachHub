import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
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
  @Get('tags/:workspaceId')
async getTags(@Param('workspaceId') workspaceId: string) {
  return this.contactsService.getTagsByWorkspace(workspaceId);
}

@Post('count-by-tags')
async countByTags(@Body() body: { workspaceId: string; tags: string[] }) {
  return this.contactsService.countByTags(body.workspaceId, body.tags || []);
}

@Post('by-tags')
async findByTags(@Body() body: { workspaceId: string; tags: string[] }) {
  return this.contactsService.findByTags(body.workspaceId, body.tags || []);
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

 @Get('byWorkspace/:workspaceId')
async findByWorkspace(
  @Param('workspaceId') workspaceId: string,
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
  return this.contactsService.findByWorkspace(workspaceId, Number(page), Number(limit));
}
@Patch(':id')
async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto, @Req() req: any) {
  return this.contactsService.update(id, updateContactDto, req.user.userId);
}

@Delete(':id')
async remove(@Param('id') id: string, @Req() req: any) {
  return this.contactsService.remove(id, req.user.userId);
}

}
