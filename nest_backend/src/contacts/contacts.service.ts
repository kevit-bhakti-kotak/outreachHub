import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async create(createDto: CreateContactDto, userId: string): Promise<Contact> {
    const contact = new this.contactModel({
      ...createDto,
      createdBy: new Types.ObjectId(userId),
    });
    return contact.save();
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().populate('workspaceId createdBy').exec();
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async update(id: string, updateDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async remove(id: string) {
    const result = await this.contactModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Contact not found');
    return result;
  }
}
