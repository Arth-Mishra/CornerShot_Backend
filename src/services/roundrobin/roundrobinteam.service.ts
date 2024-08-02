import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateroundrobinTeamDto } from 'src/dto/create-roundrobin-team.dto';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { Roping } from 'src/models/roping.entity';
import { RoundrobinTeam } from 'src/models/roundrobin-team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoundrobinService {
  constructor(
    @InjectRepository(DrawEntries)
    private readonly drawEntriesRepository: Repository<DrawEntries>,
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
    @InjectRepository(RoundrobinTeam)
    private readonly teamRepository: Repository<RoundrobinTeam>,
    @InjectRepository(Roping)
    private readonly ropingRepository: Repository<Roping>,
  ) {}

  async createRoundRobinTeams(
    createTeamDto: CreateroundrobinTeamDto,
  ): Promise<RoundrobinTeam[]> {
    const { ropingId, classification } = createTeamDto;

    // console.log('Received DTO:', createTeamDto);

    const drawEntries = await this.drawEntriesRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['roping', 'contestant'],
    });

    // console.log('Draw entries:', drawEntries);

    if (!drawEntries || drawEntries.length === 0) {
      throw new NotFoundException(
        `No draw entries found for this roping `,
      );
    }

    // Separate headers and healers based on their entries
    const headers = drawEntries.filter(
      (entry) =>
        entry.header_entries === 1 && entry.header_rating <= classification,
    );
    const healers = drawEntries.filter(
      (entry) =>
        entry.healer_entries === 1 && entry.healer_rating <= classification,
    );

    // console.log('Headers:', headers);
    // console.log('Healers:', healers);

    const validPairings = [];
const healerPaired = new Set();

// Check if all headers can pair with all healers within the classification
for (const headerEntry of headers) {
  const validPairsForHeader = healers.filter(
    (healerEntry) =>
      headerEntry.header_rating + healerEntry.healer_rating <= classification,
  );

  if (validPairsForHeader.length === 0) {
    throw new BadRequestException(
      'Not all headers can be paired as per classification, no teams will be created.',
    );
  }

  validPairings.push(
    ...validPairsForHeader.map((healerEntry) => ({
      headerEntry,
      healerEntry,
    })),
  );

  validPairsForHeader.forEach((healerEntry) =>
    healerPaired.add(healerEntry.id),
  );
}

// Ensure every healer is paired with at least one header
if (healers.some((healer) => !healerPaired.has(healer.id))) {
  throw new BadRequestException(
    'Not all healers are paired with at least one header, no teams will be created.',
  );
}


    const teams: RoundrobinTeam[] = [];

    // Create teams if validation passed
    for (const { headerEntry, healerEntry } of validPairings) {
      const team = this.teamRepository.create({
        header: headerEntry.contestant,
        healer: healerEntry.contestant,
        roping: await this.ropingRepository.findOne({
          where: { id: ropingId },
        }),
      });

      const savedTeam = await this.teamRepository.save(team);
      console.log('Created team:', savedTeam);
      teams.push(savedTeam);
    }

    // console.log('Final teams:', teams);
    return teams;
  }

  async getTeamsByRopingId(ropingId: number): Promise<RoundrobinTeam[]> {
    const roping = await this.ropingRepository.findOne({
      where: { id: ropingId },
    });
    if (!roping) {
      throw new NotFoundException(`Roping not found`);
    }

    const teams = await this.teamRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['header', 'healer', 'roping'],
    });

    if (!teams || teams.length === 0) {
      throw new NotFoundException(`No teams found for this roping `);
    }

    return teams;
  }

  async deleteTeamsByRopingId(ropingId: number): Promise<void> {
    const roping = await this.ropingRepository.findOne({
      where: { id: ropingId },
    });
    if (!roping) {
      throw new NotFoundException(`Roping not found`);
    }

    const teams = await this.teamRepository.find({
      where: { roping: { id: ropingId } },
    });

    if (!teams || teams.length === 0) {
      throw new NotFoundException(`No teams found for this roping `);
    }

    await this.teamRepository.remove(teams);
  }
}
