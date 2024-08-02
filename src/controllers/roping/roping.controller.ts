import { Controller, Post, Body, Get, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { CreateRopingCompleteDto } from 'src/dto/create-roping-complete.dto';
import { GetRopingDetailsDto } from 'src/dto/get-roping-details.dto';
import { GetRopingsDto } from 'src/dto/get-ropings.dto';
import { UpdateRopingClassificationDto } from 'src/dto/update-roping-classification.dto';
import { UpdateRopingCompleteDto } from 'src/dto/update-roping-complete-dto';
import { UpdateRopingFinancialsDto } from 'src/dto/update-roping-financials.dto';
import { UpdateRopingRulesDto } from 'src/dto/update-roping-rules.dto';
import { UpdateRopingDto } from 'src/dto/update-roping.dto';
import { Production } from 'src/models/production.entity';
import { RopingClassification } from 'src/models/roping-classification.entity';
import { RopingFinancials } from 'src/models/roping-financials.entity';
import { RopingRules } from 'src/models/roping-rules.entity';
import { Roping } from 'src/models/roping.entity';
import { RopingService } from 'src/services/roping/roping.service';


@Controller('/ropings')
export class RopingController {
  constructor(private readonly ropingService: RopingService) {}

  @Post('/create')
  async create(@Body() body: CreateRopingCompleteDto) {
      await this.ropingService.createRoping(body);
      return { message: 'Roping Created' };
   
  }

  @Get('getnames/:productionId')
  async getRopingsByProductionId(
    @Param() params: GetRopingsDto,
  ): Promise<{ id: number; name: string }[]> {
    const { productionId } = params;
    return this.ropingService.getRopingsByProductionId(productionId);
  }
  @Get('getroping/:ropingId')
  async getRopingDetails(@Param() params: GetRopingDetailsDto): Promise<{
    roping: Roping;
    ropingRules: RopingRules;
    ropingFinancials: RopingFinancials;
    ropingClassification: RopingClassification | null;
  }> {
    const { ropingId } = params;
    return this.ropingService.getRopingDetails(ropingId);
  }

  @Put('updateroping/:id')
  async updateRoping(
    @Param('id') id: number,
    @Body() updateRopingCompleteDto: UpdateRopingCompleteDto,
  ) {

    try {
      await this.ropingService.updateRoping(id, updateRopingCompleteDto);
      return{message: 'Roping Updated'};
    }
    catch (error) {
      console.error('Error updating roping:', error);
      return { message: 'Error updating roping' };
    }
  }
}