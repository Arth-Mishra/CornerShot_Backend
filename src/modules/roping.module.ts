import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RopingController } from "src/controllers/roping/roping.controller";
import { Production } from "src/models/production.entity";
import { RopingClassification } from "src/models/roping-classification.entity";
import { RopingFinancials } from "src/models/roping-financials.entity";
import { RopingRules } from "src/models/roping-rules.entity";
import { Roping } from "src/models/roping.entity";
import { RopingService } from "src/services/roping/roping.service";




@Module({
  imports: [
    TypeOrmModule.forFeature([
      Roping,
      RopingRules,
      RopingFinancials,
      RopingClassification,
      Production,
    ]),
  ],
  providers: [RopingService],
  controllers: [RopingController],
})
export class RopingModule {}
