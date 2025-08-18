import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({
    type: [
      {
        workspaceId: { type: Types.ObjectId, ref: 'Workspace' },
        role: { type: String, enum: ['Editor', 'Viewer'], default: 'Viewer' },
      },
    ],
  })
  workspaces: { workspaceId: Types.ObjectId; role: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
