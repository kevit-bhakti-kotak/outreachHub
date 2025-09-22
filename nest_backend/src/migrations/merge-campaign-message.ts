import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CampaignMessage, CampaignMessageSchema } from '../../src/campaign-mesage/schemas/campaign-message.schema';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env for MONGO_URI

// -------------------
// Minimal module for migration
// -------------------
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://bhaktikotak:VyEzUouws9dzFUGp@bhakti.fkqpbgi.mongodb.net/outreachHub_nest?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: CampaignMessage.name, schema: CampaignMessageSchema }]),
  ],
})
class MigrationModule {}

// -------------------
// Migration script
// -------------------
async function bootstrap() {
  const DRY_RUN = process.env.DRY_RUN === 'true';

  const app = await NestFactory.createApplicationContext(MigrationModule);

  const campaignMessageModel = app.get<Model<CampaignMessage>>(getModelToken(CampaignMessage.name));

  console.log(`Starting CampaignMessage merge migration... DRY_RUN=${DRY_RUN}`);

  const allMessages = await campaignMessageModel.find().lean();
  console.log(`Fetched ${allMessages.length} total CampaignMessage documents.`);

  // Group by unique key
  const grouped: Record<string, any[]> = {};

  allMessages.forEach((msg) => {
    const key = JSON.stringify({
      workspace: msg.workspace.toString(),
      campaign: msg.campaign.toString(),
      createdBy: msg.createdBy.toString(),
      messageContent: msg.messageContent,
      sentAt: msg.sentAt.toISOString(),
    });

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(msg);
  });

  console.log(`Found ${Object.keys(grouped).length} unique messages to merge.`);

  // Merge duplicates
  for (const keyStr of Object.keys(grouped)) {
    const duplicates = grouped[keyStr];
    if (duplicates.length <= 1) continue;

    const mergedContactIds = Array.from(
      new Set(duplicates.flatMap((d) => d.contactIds.map((id) => id.toString())))
    ).map((id) => new Types.ObjectId(id));

    const baseDoc = duplicates[0];

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would merge ${duplicates.length} docs into one for messageContent="${baseDoc.messageContent}"`);
      console.log(`[DRY RUN] Merged contactIds:`, mergedContactIds);
      console.log(`[DRY RUN] Would delete duplicate IDs:`, duplicates.slice(1).map(d => d._id.toString()));
    } else {
      await campaignMessageModel.updateOne(
        { _id: baseDoc._id },
        { $set: { contactIds: mergedContactIds } }
      );

      const idsToDelete = duplicates.slice(1).map((d) => d._id);
      await campaignMessageModel.deleteMany({ _id: { $in: idsToDelete } });

      console.log(`Merged ${duplicates.length} documents into one for messageContent="${baseDoc.messageContent}"`);
    }
  }

  console.log('Migration completed.');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
