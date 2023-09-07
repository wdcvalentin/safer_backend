import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type RecordDocument = Record & Document;

@Schema()
export class Record {
  @Prop({ required: false })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  locationUrl: string;

  @Prop({ required: false })
  location: string;

  @Prop({ required: false })
  device: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
