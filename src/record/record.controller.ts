import { Body, Controller, Post } from '@nestjs/common';
import { UserRecord } from './record.interfaces';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @Post()
  userRecord(@Body() userRecord: UserRecord): Promise<any> {
    return this.recordService.create(userRecord);
  }
}
