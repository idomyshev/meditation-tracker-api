import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meditation } from '../entities/meditation.entity';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meditation])],
  controllers: [MeditationsController],
  providers: [MeditationsService],
  exports: [MeditationsService],
})
export class MeditationsModule {} 