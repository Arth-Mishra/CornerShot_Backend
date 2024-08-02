import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestantService } from 'src/services/contestant/contestant.service';
import { ContestantController } from 'src/controllers/contestant/contestant.controller';
import { Contestant } from 'src/models/contestant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contestant])],
  providers: [ContestantService],
  controllers: [ContestantController],
})
export class ContestantModule {}
