import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { Roping } from 'src/models/roping.entity';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntriesResponseDto } from 'src/dto/draw-entries-response.dto';
import { UpdateDrawEntriesDto } from 'src/dto/update-draw-entries.dto';
import { CreateDrawEntryDto } from 'src/dto/create-draw-entries.dto';

@Injectable()
export class DrawEntriesService {
  constructor(
    @InjectRepository(DrawEntries)
    private readonly drawEntriesRepository: Repository<DrawEntries>,
    @InjectRepository(Roping)
    private readonly ropingRepository: Repository<Roping>,
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
  ) {}

  async createDrawEntry(
    createDrawEntryDto: CreateDrawEntryDto,
  ): Promise<DrawEntries> {
    const {
      roping_id,
      contestant_id,
      header_rating,
      healer_rating,
      header_entries,
      healer_entries,
    } = createDrawEntryDto;

    const existingEntry = await this.drawEntriesRepository.findOne({
      where: {
        roping: { id: roping_id },
        contestant: { id: contestant_id },
      },
    });

    if (existingEntry) {
      
      throw new ConflictException(
        'This contestant is already registered for the given roping.',
      );
    }

    const drawEntry = this.drawEntriesRepository.create({
      header_rating,
      healer_rating,
      header_entries,
      healer_entries,
      roping: { id: roping_id } as Roping,
      contestant: { id: contestant_id } as Contestant,
    });

    return this.drawEntriesRepository.save(drawEntry);
  }

  async findByRopingId(ropingId: number): Promise<DrawEntriesResponseDto[]> {
    const drawEntries = await this.drawEntriesRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['roping', 'contestant'],
    });

    return drawEntries.map((entry) => ({
      id: entry.id,
      header_rating: entry.header_rating,
      healer_rating: entry.healer_rating,
      header_entries: entry.header_entries,
      healer_entries: entry.healer_entries,
      contestant: {
        name: entry.contestant.name,
      },
    }));
  }

  async deleteByContestantAndRopingId(
    contestantId: number,
    ropingId: number,
  ): Promise<void> {
    console.log('contestantId', contestantId);
    console.log('ropingId', ropingId);
    const drawEntry = await this.drawEntriesRepository.findOne({
      where: {
        roping: { id: ropingId },
        contestant: { id: contestantId },
      },
    });
    console.log('drawEntry', drawEntry);

    if (!drawEntry) {
      throw new NotFoundException(
        `Draw entries for contestant ID ${contestantId} and roping ID ${ropingId} not found`,
      );
    }

    await this.drawEntriesRepository.remove(drawEntry);
  }

  async updateByContestantAndRopingId(
    contestantId: number,
    updateDrawEntriesDto: UpdateDrawEntriesDto,
  ): Promise<void> {
    const {
      roping_id,
      header_rating,
      healer_rating,
      header_entries,
      healer_entries,
    } = updateDrawEntriesDto;

    // Update draw entries
    const drawEntry = await this.drawEntriesRepository.findOne({
      where: {
        roping: { id: roping_id },
        contestant: { id: contestantId },
      },
      relations: ['roping', 'contestant'],
    });

    if (!drawEntry) {
      throw new NotFoundException(
        `Draw entries for contestant ID ${contestantId} and roping ID ${roping_id} not found`,
      );
    }

    drawEntry.header_rating = header_rating;
    drawEntry.healer_rating = healer_rating;
    drawEntry.header_entries = header_entries;
    drawEntry.healer_entries = healer_entries;

    await this.drawEntriesRepository.save(drawEntry);

    // Update contestant
    const contestant = await this.contestantRepository.findOne({
      where: { id: contestantId },
    });
    if (!contestant) {
      throw new NotFoundException(
        `Contestant with ID ${contestantId} not found`,
      );
    }

    contestant.header_rating = header_rating;
    contestant.healer_rating = healer_rating;

    await this.contestantRepository.save(contestant);
  }
}
