import {
  Controller,
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
import { ProductionService } from 'src/services/production/production.service';

@Controller('/production')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(InternalServerInterceptor)
export class ProductionController {
  constructor(private productionService: ProductionService) {}

  @Post()
  async create(@Req() request: Request) {
    return await this.productionService.createProduction(request);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Req() request: Request) {
    return await this.productionService.updateProduction(id, request);
  }

  @Get()
  async findAll(@Req() request: Request) {
    return await this.productionService.findAll(request);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    return await this.productionService.findOne(id, request);
  }
}
