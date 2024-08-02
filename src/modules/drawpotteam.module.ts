import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RopingteamController } from 'src/controllers/drawpot team/drawpotteam.controller';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { Team } from 'src/models/drawpot-teams';
import { Roping } from 'src/models/roping.entity';
import { Ropingteamservice } from 'src/services/drawpot.service/roping-types&teams.services';

@Module({
  imports: [TypeOrmModule.forFeature([Team, DrawEntries, Roping, Contestant])],
  providers: [Ropingteamservice],
  controllers: [RopingteamController],
  exports: [Ropingteamservice],
})
export class DrawPotTeamModule {}
