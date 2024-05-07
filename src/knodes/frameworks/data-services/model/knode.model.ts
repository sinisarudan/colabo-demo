import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

//TODO: to update to new practices of NOT using Document (as in new `colabo`):
export type KNodeDocument = KNode & mongoose.Document;

@Schema({ timestamps: true })
export class KNode {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  visual: Record<string, unknown>;

  @Prop()
  activeVersion: number;

  @Prop()
  version: number;

  @Prop({ default: true })
  isPublic: boolean = true;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  dataContent: Record<string, unknown>;

  @Prop()
  mapId: string;

  @Prop()
  iAmId: string;
}

export const KNodeSchema = SchemaFactory.createForClass(KNode);
