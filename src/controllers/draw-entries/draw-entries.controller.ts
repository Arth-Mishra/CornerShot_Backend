import { Controller, Post, Body, Get, Param, Delete, Put, ConflictException } from '@nestjs/common';
import { DrawEntriesService } from 'src/services/draw-entries/draw-entries.Services';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { DrawEntriesResponseDto } from 'src/dto/draw-entries-response.dto';
import { UpdateDrawEntriesDto } from 'src/dto/update-draw-entries.dto';
import { CreateDrawEntryDto } from 'src/dto/create-draw-entries.dto';

@Controller('draw-entries')
export class DrawEntriesController {
  constructor(private readonly drawEntriesService: DrawEntriesService) {}

  @Post('/AddDrawEntry')
  async createDrawEntry(@Body() createDrawEntriesDto: CreateDrawEntryDto) {
    // return this.drawEntriesService.createDrawEntry(createDrawEntriesDto);
      await this.drawEntriesService.createDrawEntry(createDrawEntriesDto);
      return { message: 'Draw Created' };
   
  }

  @Get('getdraw/:id')
  async getDrawEntriesByRopingId(
    @Param('id') id: number,
  ): Promise<DrawEntriesResponseDto[]> {
    return this.drawEntriesService.findByRopingId(Number(id));
  }

  @Delete('deletedraw/:id')
  async deleteDrawEntriesByContestantAndRopingId(
    @Param('id') contestantId: number,
    @Body('roping_id') ropingId: number,
  ) {
    await this.drawEntriesService.deleteByContestantAndRopingId(Number(contestantId), Number(ropingId));
     return { message: 'Draw entry deleted' };
    
  }

  @Put('updatedraw/:id')
  async updateDrawEntriesByContestantId(
    @Param('id') id: number,
    @Body() updateDrawEntriesDto: UpdateDrawEntriesDto,
  ) {
    // await this.drawEntriesService.updateByContestantAndRopingId(
    //   Number(id),
    //   updateDrawEntriesDto,
    // );
   
      await this.drawEntriesService.updateByContestantAndRopingId(
        Number(id),
        updateDrawEntriesDto,
      );
      return { message: 'Draw entry and contastent updated' };
    
  }
}
