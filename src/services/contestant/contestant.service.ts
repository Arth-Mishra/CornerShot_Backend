import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Common } from 'src/dto/common.dto';
import { ContestantDto } from 'src/dto/contestant.dto';
import { Contestant } from 'src/models/contestant.entity';
import { contestantUtil } from 'src/utils/contestant.util';
import { Repository } from 'typeorm';

@Injectable()
export class ContestantService {
  constructor(
    @InjectRepository(Contestant)
    private contestantRepository: Repository<Contestant>,
  ) {}

  async createContestant(request: Request<any, any, ContestantDto>) {
    const { userId } = request.user;
    const { email } = request.body;

    contestantUtil.checkEmptyFields(request.body);

    const exists = await this.contestantRepository.exists({
      where: { email, user: { id: userId } },
    });

    if (!exists) {
      const body = {
        user: { id: userId },
        ...request.body,
      };
      const contestant = this.contestantRepository.create(body);
      await this.contestantRepository.save(contestant);
      return {
        success: true,
        message: 'Contestant created successfully',
      };
    } else {
      throw new ConflictException('Contestant already exists');
    }
  }

  async updateContestant(
    id: string,
    request: Request<any, any, ContestantDto>,
  ) {
    const paramId = Number(id);
    const { userId } = request.user;
    const { email } = request.body;

    contestantUtil.checkEmptyFields(request.body);

    const contestant = await this.contestantRepository.findOne({
      where: { id: paramId, user: { id: userId } },
    });
    if (contestant) {
      const emailContestant = await this.contestantRepository.findOne({
        where: { email, user: { id: userId } },
      });
      if (!emailContestant || emailContestant.id === paramId) {
        await this.contestantRepository.update(id, request.body);
        return { success: true, message: 'Contestant updated successfully' };
      } else {
        throw new BadRequestException(
          `A contestant with email ${email} already exists`,
        );
      }
    } else {
      throw new NotFoundException('Contestant not found');
    }
  }

  async findAll(request: Request): Promise<Common<Contestant[]>> {
    const { userId } = request.user;

    const contestants = await this.contestantRepository.find({
      where: { user: { id: userId } },
      select: {
        id: true,
        name: true,
        phone_number: true,
        email: true,
        header_rating: true,
        healer_rating: true,
      },
    });
    return { success: true, data: contestants };
  }

  async findOne(
    id: string,
    request: Request,
  ): Promise<Common<Contestant>> {
    const { userId } = request.user;

    const contestant = await this.contestantRepository.findOne({
      where: { id: Number(id), user: { id: userId } },
      select: {
        id: true,
        name: true,
        phone_number: true,
        email: true,
        header_rating: true,
        healer_rating: true,
      },
    });
    if (!contestant) {
      throw new NotFoundException('Contestant not found');
    }
    return { success: true, data: contestant };
  }

  async delete(id: string, request: Request) {
    const paramId = Number(id);
    const { userId } = request.user;

    const exists = await this.contestantRepository.exists({
      where: { id: paramId, user: { id: userId } },
    });
    if (exists) {
      await this.contestantRepository.delete({ id: paramId });
      return { success: true, message: 'Contestant deleted successfully' };
    } else {
      throw new NotFoundException('Contestant not found');
    }
  }
}
