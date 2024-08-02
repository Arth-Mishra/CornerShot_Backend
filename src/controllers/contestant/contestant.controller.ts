import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { InternalServerInterceptor } from 'src/middleware/interceptor';
import { ContestantService } from 'src/services/contestant/contestant.service';

@Controller('/contestant')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(InternalServerInterceptor)
export class ContestantController {
  constructor(private contestantService: ContestantService) {}

  @Post()
  async create(@Req() request: Request) {
    return await this.contestantService.createContestant(request);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Req() request: Request) {
    return await this.contestantService.updateContestant(id, request);
  }

  @Get()
  async findAll(@Req() request: Request) {
    return await this.contestantService.findAll(request);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    return await this.contestantService.findOne(id, request);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() request: Request) {
    return await this.contestantService.delete(id, request);
  }
}
