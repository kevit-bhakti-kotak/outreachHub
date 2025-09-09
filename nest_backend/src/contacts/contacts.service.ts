import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
      workspaceId: createDto.workspaceId,
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
  //paginated get by workspace...
  async findByWorkspace(workspaceId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    this.contactModel
      .find({ workspaceId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    this.contactModel.countDocuments({ workspaceId }),
  ]);

  return {
    data: items,
    total,
    page,
    limit,
  };
}

async update(id: string, updateDto: UpdateContactDto, userId: string){
  const contact = await this.contactModel.findById(id).exec();
  if (!contact) throw new NotFoundException('Contact not found');

  if (contact.createdBy.toString() !== userId) {
    throw new ForbiddenException('You can only edit contacts you created.');
  }

  return this.contactModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
}

async remove(id: string, userId: string) {
  const contact = await this.contactModel.findById(id).exec();
  if (!contact) throw new NotFoundException('Contact not found');

  if (contact.createdBy.toString() !== userId) {
    throw new ForbiddenException('You can only delete contacts you created.');
  }

  return this.contactModel.findByIdAndDelete(id).exec();
}
}
