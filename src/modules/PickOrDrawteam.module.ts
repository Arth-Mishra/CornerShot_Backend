import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickOrDrawController } from 'src/controllers/PickOrDraw/PickOrDraw-team.controller';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { PickOrDrawTeam } from 'src/models/PickOrDraw-team.entity';
import { Roping } from 'src/models/roping.entity';
import { PickOrDrawTeamService } from 'src/services/PickOrDraw/PickOrDraw-team.service';

@Module({
  imports: [TypeOrmModule.forFeature([PickOrDrawTeam, DrawEntries, Roping, Contestant])],
  providers: [PickOrDrawTeamService],
  controllers: [PickOrDrawController],
  exports: [PickOrDrawTeamService],
})
export class PickOrDrawTeamModule {}
