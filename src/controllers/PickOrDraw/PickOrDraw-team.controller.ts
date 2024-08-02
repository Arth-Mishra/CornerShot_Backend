import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CreateDrawEntryDto } from 'src/dto/create-draw-entries.dto';
import { CreateTeamDto } from 'src/dto/createdrawpotteam.dto';
import { CreatePickOnlyTeamDto } from 'src/dto/createpickonly-team.dto';
import { PickOnlyTeamDeleteDto } from 'src/dto/delete-pickonly-team.dto';
import { PickOrDrawTeam } from 'src/models/PickOrDraw-team.entity';
import { PickOrDrawTeamService } from 'src/services/PickOrDraw/PickOrDraw-team.service';




@Controller('PickOrDraw')
export class PickOrDrawController {
  constructor(private readonly PickOrDrawService: PickOrDrawTeamService) {}

  @Post('/AddDrawEntry')
  async createDrawEntry(@Body() createDrawEntriesDto: CreateDrawEntryDto) {
    // return this.drawEntriesService.createDrawEntry(createDrawEntriesDto);
    await this.PickOrDrawService.createDrawEntry(createDrawEntriesDto);
    return { message: 'Draw Created' };
  }

  @Post('createteam')
  async createPickOnlyTeam(@Body() createTeamDto: CreatePickOnlyTeamDto) {
    await this.PickOrDrawService.createPickOnlyTeam(createTeamDto);
    return { message: ' Team Created' };
  }

  @Post('teams')
  async createTeams(@Body() createTeamDto: CreateTeamDto) {
    await this.PickOrDrawService.createdrawpotTeams(createTeamDto);
    return { message: 'Team Created' };
  }

  @Get('get-teams/:ropingId')
  async getTeamsByRopingId(
    @Param('ropingId') ropingId: number,
  ): Promise<PickOrDrawTeam[]> {
    return this.PickOrDrawService.findTeamsByRopingId(ropingId);
  }

  @Delete('delete-teams')
  async deleteTeam(@Body() deleteTeamDto: PickOnlyTeamDeleteDto) {
    const { header_Id, healer_Id, roping_Id } = deleteTeamDto;
    await this.PickOrDrawService.deleteTeam(header_Id, healer_Id, roping_Id);
    return { message: 'Team Deleted' };
  }

  @Delete('delete-drawteams/:ropingId')
  async deleteTeams(@Param('ropingId', ParseIntPipe) ropingId: number) {
    await this.PickOrDrawService.deleteTeamsByRopingId(ropingId);
    return { message: 'Team deleted' };
  }
  
}