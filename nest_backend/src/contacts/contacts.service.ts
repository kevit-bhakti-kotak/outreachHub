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
 async getTagsByWorkspace(workspaceId: string): Promise<string[]> {
  const contacts = await this.contactModel.find({ workspaceId }, { tags: 1 }).exec();
  const tags = new Set<string>();
  contacts.forEach(c => c.tags?.forEach(t => tags.add(t)));
  return Array.from(tags);
}


async countByTags(workspaceId: string, tags: string[]): Promise<number> {
  return this.contactModel.countDocuments({
    workspaceId,
    tags: { $in: tags }
  });
}

async findByTags(workspaceId: string, tags: string[]): Promise<Contact[]> {
  return this.contactModel.find({
    workspaceId,
    tags: { $in: tags }
  }).exec();
}

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }
  //paginated get by workspace...
  // src/contacts/contacts.service.ts
async findByWorkspace(
  workspaceId: string,
  page = 1,
  limit = 5,
  q?: string,
  tags: string[] = []
) {
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};

  // workspaceId can be string or ObjectId - support both
  query.workspaceId = workspaceId;


  // text search (name or phoneNumber) - case-insensitive partial match
  if (q && q.trim()) {
    const re = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // escape user input
    query.$or = [{ name: re }, { phoneNumber: re }];
  }

  // tags filter (any of the tags)
  if (Array.isArray(tags) && tags.length > 0) {
    query.tags = { $in: tags };
  }
  console.log('findByWorkspace query:', query);

  const [items, total] = await Promise.all([
    
    this.contactModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    this.contactModel.countDocuments(query).exec(),
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
