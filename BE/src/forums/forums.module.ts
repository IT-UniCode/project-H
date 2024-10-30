import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { RequestService } from 'src/request/request.service';

@Module({
  controllers: [ForumsController],
  providers: [ForumsService, RequestService],
})
export class ForumsModule {}
