import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRecord } from './record.interfaces';
import { RecordDocument } from './record.schema';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel('Record') private readonly recordModel: Model<RecordDocument>,
  ) {}

  async create(recordData: UserRecord): Promise<RecordDocument> {
    console.log('[create]: saving new record');
    const newRecord = new this.recordModel(recordData);
    return newRecord.save();
  }
}
