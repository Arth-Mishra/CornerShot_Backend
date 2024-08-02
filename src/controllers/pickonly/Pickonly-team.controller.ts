import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CreatePickOnlyTeamDto } from 'src/dto/createpickonly-team.dto';
import { PickOnlyTeamDeleteDto } from 'src/dto/delete-pickonly-team.dto';
import { PickonlyTeam } from 'src/models/pickonly-team.entity';
import { PickOnlyTeamservice } from 'src/services/PickOnly/Pickonly-team.service';


@Controller('pickonly')
export class PickonlyTeamController {
  constructor(private readonly pickonlyTeamService: PickOnlyTeamservice) {}

  @Post('createteam')
  async createPickOnlyTeam(@Body() createTeamDto: CreatePickOnlyTeamDto) {
    await this.pickonlyTeamService.createPickOnlyTeam(createTeamDto);
    return { message: ' Team Created' };
  }

  @Get('get-teams/:ropingId')
  async getTeamsByRopingId(
    @Param('ropingId') ropingId: number,
  ): Promise<PickonlyTeam[]> {
    return this.pickonlyTeamService.findTeamsByRopingId(ropingId);
  }

  @Delete("delete-teams")
  async deleteTeam(
    @Body() deleteTeamDto: PickOnlyTeamDeleteDto,
  ) {
    const { header_Id, healer_Id, roping_Id } = deleteTeamDto;
    await this.pickonlyTeamService.deleteTeam(header_Id, healer_Id, roping_Id);
    return{message:"Team Deleted"}
  }
}
