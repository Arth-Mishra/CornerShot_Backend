import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from 'src/dto/createdrawpotteam.dto';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { Team } from 'src/models/drawpot-teams';
import { Roping } from 'src/models/roping.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Ropingteamservice {
  constructor(
    @InjectRepository(DrawEntries)
    private readonly drawEntriesRepository: Repository<DrawEntries>,
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Roping)
    private readonly ropingRepository: Repository<Roping>,
  ) {}

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async createdrawpotTeams(createTeamDto: CreateTeamDto): Promise<Team[]> {
    const { ropingId, classification } = createTeamDto;

    let drawEntries = await this.drawEntriesRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['roping', 'contestant'],
    });

    if (!drawEntries || drawEntries.length === 0) {
      throw new NotFoundException(
        `No draw entries found for roping ID ${ropingId}`,
      );
    }

    drawEntries = this.shuffleArray(drawEntries);

    const headers = drawEntries.filter(
      (entry) =>
        entry.header_entries === 1 && entry.header_rating <= classification,
    );
    const healers = drawEntries.filter(
      (entry) =>
        entry.healer_entries === 1 && entry.healer_rating <= classification,
    );
    

    const specificTeams: { header: DrawEntries; healer: DrawEntries }[] = [];
    const remainingHeaders = [...headers];
    const remainingHealers = [...healers];

    // Step 1: Identify all specific pairs and re-check until no new specific pairs are found
    let newSpecificPairFound;
    do {
      newSpecificPairFound = false;
      for (const header of remainingHeaders) {
        const possibleHealers = remainingHealers.filter(
          (healer) =>
            header.header_rating + healer.healer_rating <= classification,
        );

        if (possibleHealers.length === 1) {
          // Only one possible healer for this header
          const healer = possibleHealers[0];
          specificTeams.push({ header, healer });
          remainingHeaders.splice(remainingHeaders.indexOf(header), 1);
          remainingHealers.splice(remainingHealers.indexOf(healer), 1);
          newSpecificPairFound = true;
          break; // Break to recheck from the start after finding a new specific pair
        }
      }
    } while (newSpecificPairFound);

    // Step 2: Generate all valid teams from the remaining headers and healers
    const possibleTeams: { header: DrawEntries; healer: DrawEntries }[] = [];

    for (const headerEntry of remainingHeaders) {
      for (const healerEntry of remainingHealers) {
        if (
          headerEntry.header_rating + healerEntry.healer_rating <=
          classification
        ) {
          possibleTeams.push({ header: headerEntry, healer: healerEntry });
        }
      }
    }

    // Step 3: Save all specific teams first
    const uniqueTeams: Team[] = [];
    const usedHeaders = new Set<string>();
    const usedHealers = new Set<string>();

    const specificRoping = await this.ropingRepository.findOne({
      where: { id: ropingId },
    });

    for (const { header, healer } of specificTeams) {
      const team = this.teamRepository.create({
        header: header.contestant,
        healer: healer.contestant,
        roping: specificRoping,
      });
      uniqueTeams.push(team);
      usedHeaders.add(header.contestant.id.toString());
      usedHealers.add(healer.contestant.id.toString());
    }

    // Shuffle the remaining headers and healers to ensure random pairing each time
    this.shuffleArray(remainingHeaders);
    this.shuffleArray(remainingHealers);

    // Randomly pair remaining headers and healers
    while (remainingHeaders.length > 0 && remainingHealers.length > 0) {
      const header = remainingHeaders.pop();
      const healer = remainingHealers.pop();

      if (
        header &&
        healer &&
        header.header_rating + healer.healer_rating <= classification
      ) {
        const team = this.teamRepository.create({
          header: header.contestant,
          healer: healer.contestant,
          roping: specificRoping,
        });
        uniqueTeams.push(team);
        usedHeaders.add(header.contestant.id.toString());
        usedHealers.add(healer.contestant.id.toString());
      }
    }

    if(uniqueTeams.length<headers.length)
    {
      throw new BadRequestException(
        'Cannot create teams: Not all headers or healers can be paired within the given classification.',
      );
    }

    // Save unique teams
    for (const team of uniqueTeams) {
      await this.teamRepository.save(team);
    }

    return uniqueTeams;
  }
  async getTeamsByRopingId(ropingId: number): Promise<Team[]> {
    const teams = await this.teamRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['header', 'healer', 'roping'],
    });

    if (!teams || teams.length === 0) {
      throw new NotFoundException(`No teams found for roping`);
    }

    return teams;
  }
  async deleteTeamsByRopingId(ropingId: number): Promise<void> {
    const teams = await this.teamRepository.find({
      where: { roping: { id: ropingId } },
    });

    if (!teams || teams.length === 0) {
      throw new NotFoundException(`No teams found for roping`);
    }

    await this.teamRepository.remove(teams);
  }
}
