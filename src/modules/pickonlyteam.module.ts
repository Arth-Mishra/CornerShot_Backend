import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PickonlyTeamController } from "src/controllers/pickonly/Pickonly-team.controller";
import { Contestant } from "src/models/contestant.entity";
import { PickonlyTeam } from "src/models/pickonly-team.entity";
import { Roping } from "src/models/roping.entity";
import { PickOnlyTeamservice } from "src/services/PickOnly/Pickonly-team.service";





@Module({
  imports: [TypeOrmModule.forFeature([PickonlyTeam, Roping, Contestant])],
  providers: [PickOnlyTeamservice],
  controllers: [PickonlyTeamController],
  exports: [PickOnlyTeamservice],
})
export class PickOnlyTeamModule {}