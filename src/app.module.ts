import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth.module';
import { ProductionModule } from './modules/production.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ContestantModule } from './modules/contestant.module';
import { RopingModule } from './modules/roping.module';
import { Production } from './models/production.entity';
import { RopingRules } from './models/roping-rules.entity';
import { Roping } from './models/roping.entity';
import { RopingFinancials } from './models/roping-financials.entity';
import { RopingClassification } from './models/roping-classification.entity';
import { Contestant } from './models/contestant.entity';
import { User } from './models/user.entity';
import { DrawEntries } from './models/draw-entries.entity';
import { DrawEntriesModule } from './modules/draw-entries.module';
import { Team } from './models/drawpot-teams';
import { DrawPotTeamModule } from './modules/drawpotteam.module';
import { RoundRobinTeamModule } from './modules/roundrobinteam.module';
import { RoundrobinTeam } from './models/roundrobin-team.entity';
import { PickonlyTeam } from './models/pickonly-team.entity';
import { PickOnlyTeamModule } from './modules/pickonlyteam.module';
import { PickOrDrawTeamModule } from './modules/PickOrDrawteam.module';
import { PickOrDrawTeam } from './models/PickOrDraw-team.entity';
import { PickAndDrawTeam } from './models/Pick&Draw-team.entity';
import { PickAndDrawTeamModule } from './modules/Pick&Drawteam.module';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.dev', '.env.prod'] }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [
          Production,
          Roping,
          RopingRules,
          RopingFinancials,
          RopingClassification,
          Contestant,
          User,
          DrawEntries,
          Team,
          RoundrobinTeam,
          PickonlyTeam,
          PickOrDrawTeam,
          PickAndDrawTeam
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    ProductionModule,
    ContestantModule,
    RopingModule,
    DrawEntriesModule,
    DrawPotTeamModule,
    RoundRobinTeamModule,
    PickOnlyTeamModule,
    PickOrDrawTeamModule,
    PickAndDrawTeamModule
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
