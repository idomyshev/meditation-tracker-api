import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { Record } from '../entities/record.entity';
import { User } from '../entities/user.entity';
import { Meditation } from '../entities/meditation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, User, Meditation])],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
