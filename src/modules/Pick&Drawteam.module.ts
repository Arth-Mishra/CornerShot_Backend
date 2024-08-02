import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickAndDrawController } from 'src/controllers/Pick&Draw/Pick&Draw-team.controller';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { PickAndDrawTeam } from 'src/models/Pick&Draw-team.entity';
import { Roping } from 'src/models/roping.entity';
import { PickAndDrawTeamService } from 'src/services/Pick&Draw/Pick&Draw-team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PickAndDrawTeam, DrawEntries, Roping, Contestant]),
  ],
  providers: [PickAndDrawTeamService],
  controllers: [PickAndDrawController],
  exports: [PickAndDrawTeamService],
})
export class PickAndDrawTeamModule {}

