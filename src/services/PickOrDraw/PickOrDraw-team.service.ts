import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { CreateDrawEntryDto } from 'src/dto/create-draw-entries.dto';
import { CreateTeamDto } from 'src/dto/createdrawpotteam.dto';
import { CreatePickOnlyTeamDto } from 'src/dto/createpickonly-team.dto';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { PickOrDrawTeam } from 'src/models/PickOrDraw-team.entity';
import { Roping } from 'src/models/roping.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PickOrDrawTeamService {
  constructor(
    @InjectRepository(DrawEntries)
    private readonly drawEntriesRepository: Repository<DrawEntries>,
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
    @InjectRepository(PickOrDrawTeam)
    private readonly PickOrDrawTeamRepository: Repository<PickOrDrawTeam>,
    @InjectRepository(Roping)
    private readonly ropingRepository: Repository<Roping>,
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

    // Check if the contestant is already present in any team for the given roping_id
    const contestantInTeam = await this.PickOrDrawTeamRepository.findOne({
      where: [
        { header: { id: contestant_id }, roping: { id: roping_id } },
        { healer: { id: contestant_id }, roping: { id: roping_id } },
      ],
      relations: ['header', 'healer', 'roping'],
    });

    if (contestantInTeam) {
      throw new ConflictException(
        'This contestant is already part of a team for the given roping and cannot be added to the draw entries.',
      );
    }

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

  async createPickOnlyTeam(
    createTeamDto: CreatePickOnlyTeamDto,
  ): Promise<PickOrDrawTeam> {
    const {
      roping_Id,
      classification,
      header_Id,
      healer_Id,
      headerRating,
      healerRating,
    } = createTeamDto;

    console.log('Received DTO:', createTeamDto);

    // Find contestants based on provided IDs
    const header = await this.contestantRepository.findOne({
      where: { id: header_Id },
    });
    const healer = await this.contestantRepository.findOne({
      where: { id: healer_Id },
    });

    if (!header || !healer) {
      throw new NotFoundException(
        `Contestants not found for header ID: ${header_Id} or healer ID: ${healer_Id}`,
      );
    }

    // Check if header or healer is already in draw entries
    const existingDrawEntries = await this.drawEntriesRepository.find({
      where: [
        { contestant: { id: header.id }, roping: { id: roping_Id } },
        { contestant: { id: healer.id }, roping: { id: roping_Id } },
      ],
      relations: ['contestant', 'roping'],
    });
    // console.log(existingDrawEntries)

    if (existingDrawEntries.length > 0) {
      throw new BadRequestException(
        `Header or healer is already present in the draw entries. First, remove them from the draw.`,
      );
    }

    // Check if the sum of header and healer ratings is within the classification
    if (headerRating + healerRating > classification) {
      throw new BadRequestException(
        `The sum of header rating and healer rating exceeds the classification (${classification}), no team will be created.`,
      );
    }

    // Check if header or healer is already in any team
    const existingTeams = await this.PickOrDrawTeamRepository.find({
      where: [
        { header: { id: header.id }, roping: { id: roping_Id } },
        { healer: { id: healer.id }, roping: { id: roping_Id } },
      ],
      relations: ['header', 'healer', 'roping'],
    });

    if (existingTeams.length > 0) {
      throw new BadRequestException(
        `Header or healer  is already present in another team.`,
      );
    }

    // Find the roping event
    const roping = await this.ropingRepository.findOne({
      where: { id: roping_Id },
    });

    if (!roping) {
      throw new NotFoundException(`Roping event not found`);
    }

    // Create and save the team
    const team = this.PickOrDrawTeamRepository.create({
      header,
      healer,
      roping,
    });

    const savedTeam = await this.PickOrDrawTeamRepository.save(team);
    console.log('Created team:', savedTeam);

    return savedTeam;
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async createdrawpotTeams(
    createTeamDto: CreateTeamDto,
  ): Promise<PickOrDrawTeam[]> {
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
    const uniqueTeams: PickOrDrawTeam[] = [];
    const usedHeaders = new Set<string>();
    const usedHealers = new Set<string>();

    const specificRoping = await this.ropingRepository.findOne({
      where: { id: ropingId },
    });

    for (const { header, healer } of specificTeams) {
      const team = this.PickOrDrawTeamRepository.create({
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
        const team = this.PickOrDrawTeamRepository.create({
          header: header.contestant,
          healer: healer.contestant,
          roping: specificRoping,
        });
        uniqueTeams.push(team);
        usedHeaders.add(header.contestant.id.toString());
        usedHealers.add(healer.contestant.id.toString());
      }
    }

    if (uniqueTeams.length < headers.length) {
      throw new BadRequestException(
        'Cannot create teams: Not all headers or healers can be paired within the given classification.',
      );
    }

    // Save unique teams
    for (const team of uniqueTeams) {
      await this.PickOrDrawTeamRepository.save(team);
    }

    return uniqueTeams;
  }

  async findTeamsByRopingId(ropingId: number): Promise<PickOrDrawTeam[]> {
    const teams = await this.PickOrDrawTeamRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['header', 'healer', 'roping'],
    });

    if (teams.length === 0) {
      throw new NotFoundException(`No teams found for roping `);
    }

    return teams;
  }

  async deleteTeam(
    headerId: number,
    healerId: number,
    ropingId: number,
  ): Promise<void> {
    const team = await this.PickOrDrawTeamRepository.findOne({
      where: {
        header: { id: headerId },
        healer: { id: healerId },
        roping: { id: ropingId },
      },
    });

    if (!team) {
      throw new NotFoundException(
        'Team with the specified header and healer in this roping not found',
      );
    }

    await this.PickOrDrawTeamRepository.remove(team);
  }

  async deleteTeamsByRopingId(ropingId: number): Promise<void> {
    const teams = await this.PickOrDrawTeamRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['header', 'healer', 'roping'],
    });

    if (!teams || teams.length === 0) {
      throw new NotFoundException(`No teams found for roping`);
    }

    const drawEntries = await this.drawEntriesRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['contestant', 'roping'],
    });

    if (!drawEntries || drawEntries.length === 0) {
      throw new NotFoundException(`No draw entries found for roping`);
    }

    // Create sets of contestant IDs from draw entries for quick lookup
    const drawContestantIds = new Set(
      drawEntries.map((entry) => entry.contestant.id),
    );

    // Filter teams to include only those where both header and healer are in draw entries
    const teamsToDelete = teams.filter(
      (team) =>
        drawContestantIds.has(team.header.id) &&
        drawContestantIds.has(team.healer.id),
    );

    if (teamsToDelete.length === 0) {
      throw new NotFoundException(
        `No teams with contestants in draw entries found for roping`,
      );
    }

    await this.PickOrDrawTeamRepository.remove(teamsToDelete);
  }
}