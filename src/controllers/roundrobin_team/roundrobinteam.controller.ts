import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateroundrobinTeamDto } from 'src/dto/create-roundrobin-team.dto';
import { RoundrobinTeam } from 'src/models/roundrobin-team.entity';
import { RoundrobinService } from 'src/services/roundrobin/roundrobinteam.service';






@Controller('roundrobin')
export class RoundRobinController {
  constructor(private readonly RoundrobinTeamService: RoundrobinService) {}

  @Post('create-teams')
  async createRoundRobinTeams(
    @Body() CreateroundrobinTeamDto: CreateroundrobinTeamDto,
  ) {
     await this.RoundrobinTeamService.createRoundRobinTeams(CreateroundrobinTeamDto,);
    return{message: "Teams Created "}
  }
  @Get('get-teams/:ropingId')
  async getTeamsByRopingId(
    @Param('ropingId', ParseIntPipe) ropingId: number,
  ): Promise<RoundrobinTeam[]> {
    return this.RoundrobinTeamService.getTeamsByRopingId(ropingId);
  }

  @Delete('delete-teams/:ropingId')
  async deleteTeamsByRopingId(
    @Param('ropingId', ParseIntPipe) ropingId: number,
  ) {
    await this.RoundrobinTeamService.deleteTeamsByRopingId(ropingId);
    return {message: "teams for this roping is deleted"}
  }
}
