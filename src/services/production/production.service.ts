import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ProductionDto } from 'src/dto/production.dto';
import { Production } from 'src/models/production.entity';
import { productionUtils } from 'src/utils/production.util';
import { Repository } from 'typeorm';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(Production)
    private productionRepository: Repository<Production>,
  ) {}

  async createProduction(request: Request) {
    const production = request.body;
    const userId = request.user.userId;
    production.user = userId;

    productionUtils.checkEmptyFields(request.body);

    const exists = await this.productionRepository.exists({
      where: { name: production.name, user: { id: userId } },
    });

    if (!exists) {
      const newProduction = this.productionRepository.create(production);
      await this.productionRepository.save(newProduction);
      return {
        success: true,
        message: 'Production created successfully',
      };
    } else {
      throw new ConflictException('Production already exists');
    }
  }

  async updateProduction(
    id: string,
    request: Request<any, any, ProductionDto>,
  ) {
    const paramId = Number(id);
    const { name } = request.body;
    const { userId } = request.user;

    productionUtils.checkEmptyFields(request.body);

    const production = await this.productionRepository.findOne({
      where: { id: paramId, user: { id: userId } },
    });
    if (production) {
      const nameProduction = await this.productionRepository.findOne({
        where: { name, user: { id: userId } },
      });

      if (!nameProduction || nameProduction.id === paramId) {
        await this.productionRepository.update(id, request.body);
        return { success: true, message: 'Production updated successfully' };
      } else {
        throw new BadRequestException(
          `A production with name ${name} already exists`,
        );
      }
    } else {
      throw new NotFoundException('Production not found');
    }
  }

  async findAll(request: Request) {
    const { userId } = request.user;

    const productions = await this.productionRepository.find({
      where: { user: { id: userId } },
      select: {
        id: true,
        name: true,
        date: true,
      },
    });
    return { success: true, data: productions };
  }

  async findOne(id: string, request: Request) {
    const paramId = Number(id);
    const { userId } = request.user;

    const production = await this.productionRepository.findOne({
      where: { id: paramId, user: { id: userId } },
      select: { id: true, name: true, date: true },
    });
    if (!production) {
      throw new NotFoundException('Production not found');
    }
    return { success: true, data: production };
  }
}
