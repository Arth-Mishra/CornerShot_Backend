import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CreateTeamDto } from 'src/dto/createdrawpotteam.dto';
import { Team } from 'src/models/drawpot-teams';
import { Ropingteamservice } from 'src/services/drawpot.service/roping-types&teams.services';

@Controller('drawpot')
export class RopingteamController {
  constructor(private readonly ropingteam: Ropingteamservice) {}

  @Post('teams')
  async createTeams(@Body() createTeamDto: CreateTeamDto) {
    await this.ropingteam.createdrawpotTeams(createTeamDto);
    return { message: 'Team Created' };
  }

  @Get(':ropingId')
  async getTeams(
    @Param('ropingId', ParseIntPipe) ropingId: number,
  ): Promise<Team[]> {
    return this.ropingteam.getTeamsByRopingId(ropingId);
  }

  @Delete(':ropingId')
  async deleteTeams(
    @Param('ropingId', ParseIntPipe) ropingId: number,
  ) {
    await this.ropingteam.deleteTeamsByRopingId(ropingId);
    return { message: "Team deleted"}
  }
}
