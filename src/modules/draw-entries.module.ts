import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { Roping } from 'src/models/roping.entity';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntriesService } from 'src/services/draw-entries/draw-entries.Services';
import { DrawEntriesController } from 'src/controllers/draw-entries/draw-entries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DrawEntries, Roping, Contestant])],
  providers: [DrawEntriesService],
  controllers: [DrawEntriesController],
})
export class DrawEntriesModule {}
