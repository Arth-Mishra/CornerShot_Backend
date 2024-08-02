import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CreatePickAndDrawTeamDto } from 'src/dto/create-pick&draw-pickteam.dto';
import { CreateTeamDto } from 'src/dto/createdrawpotteam.dto';
import { PickOnlyTeamDeleteDto } from 'src/dto/delete-pickonly-team.dto';
import { PickAndDrawTeam } from 'src/models/Pick&Draw-team.entity';

import { PickAndDrawTeamService } from 'src/services/Pick&Draw/Pick&Draw-team.service';




@Controller('PickAndDraw')
export class PickAndDrawController {
  constructor(private readonly PickAndDrawService: PickAndDrawTeamService) {}

  @Post('createteam')
  async createPickOnlyTeam(@Body() createTeamDto: CreatePickAndDrawTeamDto) {
    await this.PickAndDrawService.createPickAndDrawPickTeam(createTeamDto);
    return { message: ' Team Created' };
  }

  @Post('teams')
  async createTeams(@Body() createTeamDto: CreateTeamDto) {
    await this.PickAndDrawService.createdrawpotTeams(createTeamDto);
    return { message: 'Team Created' };
  }

  @Delete('delete-teams')
  async deleteTeam(@Body() deleteTeamDto: PickOnlyTeamDeleteDto) {
    const { header_Id, healer_Id, roping_Id } = deleteTeamDto;
    await this.PickAndDrawService.deleteTeam(header_Id, healer_Id, roping_Id);
    return { message: 'Team Deleted' };
  }

  @Get('get-teams/:ropingId')
  async getTeamsByRopingId(
    @Param('ropingId') ropingId: number,
  ): Promise<PickAndDrawTeam[]> {
    return this.PickAndDrawService.findTeamsByRopingId(ropingId);
  }

  @Delete('delete-drawteams/:ropingId')
  async deleteTeams(@Param('ropingId', ParseIntPipe) ropingId: number) {
    await this.PickAndDrawService.deleteTeamsByRopingId(ropingId);
    return { message: 'Team deleted' };
  }
}
