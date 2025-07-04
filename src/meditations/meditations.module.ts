import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';
import { Meditation } from '../entities/meditation.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meditation, User])],
  controllers: [MeditationsController],
  providers: [MeditationsService],
  exports: [MeditationsService],
})
export class MeditationsModule {}
