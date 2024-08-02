import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoundRobinController } from "src/controllers/roundrobin_team/roundrobinteam.controller";
import { Contestant } from "src/models/contestant.entity";
import { DrawEntries } from "src/models/draw-entries.entity";
import { Roping } from "src/models/roping.entity";
import { RoundrobinTeam } from "src/models/roundrobin-team.entity";
import { RoundrobinService } from "src/services/roundrobin/roundrobinteam.service";






@Module({
  imports: [
    TypeOrmModule.forFeature([RoundrobinTeam, DrawEntries, Roping, Contestant]),
  ],
  providers: [RoundrobinService],
  controllers: [RoundRobinController],
  exports: [RoundrobinService],
})
export class RoundRobinTeamModule {}
