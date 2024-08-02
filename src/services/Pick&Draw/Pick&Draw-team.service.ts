import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePickAndDrawTeamDto } from 'src/dto/create-pick&draw-pickteam.dto';
import { CreateTeamDto } from 'src/dto/createdrawpotteam.dto';
import { Contestant } from 'src/models/contestant.entity';
import { DrawEntries } from 'src/models/draw-entries.entity';
import { PickAndDrawTeam } from 'src/models/Pick&Draw-team.entity';
import { Roping } from 'src/models/roping.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PickAndDrawTeamService {
  constructor(
    @InjectRepository(DrawEntries)
    private readonly drawEntriesRepository: Repository<DrawEntries>,
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
    @InjectRepository(PickAndDrawTeam)
    private readonly PickAndDrawTeamRepository: Repository<PickAndDrawTeam>,
    @InjectRepository(Roping)
    private readonly ropingRepository: Repository<Roping>,
  ) {}

  async createPickAndDrawPickTeam(
    createTeamDto: CreatePickAndDrawTeamDto,
  ): Promise<PickAndDrawTeam> {
    const {
      roping_Id,
      classification,
      header_Id,
      healer_Id,
      header_headerRating,
      header_healerRating,
      healer_headerRating,
      healer_healerRating,
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

    // Check if the sum of header and healer ratings is within the classification
    if (header_headerRating + healer_healerRating > classification) {
      throw new BadRequestException(
        `The sum of header rating and healer rating exceeds the classification (${classification}), no team will be created.`,
      );
    }

    // Check if the contestant (either header or healer) is already in any team for the given roping_Id
    const existingTeams = await this.PickAndDrawTeamRepository.find({
      where: [
        { header: { id: header.id }, roping: { id: roping_Id } },
        { healer: { id: header.id }, roping: { id: roping_Id } },
        { header: { id: healer.id }, roping: { id: roping_Id } },
        { healer: { id: healer.id }, roping: { id: roping_Id } },
      ],
      relations: ['header', 'healer', 'roping'],
    });

    if (existingTeams.length > 0) {
      throw new BadRequestException(
        `Header or healer is already present in another team so this team can not be created`,
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
    const team = this.PickAndDrawTeamRepository.create({
      header,
      healer,
      roping,
    });

    const savedTeam = await this.PickAndDrawTeamRepository.save(team);
    console.log('Created team:', savedTeam);

    // Create draw entries for the header
    const headerDrawEntry = this.drawEntriesRepository.create({
      roping,
      contestant: header,
      header_rating: header_headerRating,
      healer_rating: header_healerRating,
      header_entries: 1,
      healer_entries: 0,
    });

    await this.drawEntriesRepository.save(headerDrawEntry);

    // Create draw entries for the healer
    const healerDrawEntry = this.drawEntriesRepository.create({
      roping,
      contestant: healer,
      header_rating: healer_headerRating,
      healer_rating: healer_healerRating,
      header_entries: 0,
      healer_entries: 1,
    });

    await this.drawEntriesRepository.save(healerDrawEntry);

    return savedTeam;
  }

  async deleteTeam(
    headerId: number,
    healerId: number,
    ropingId: number,
  ): Promise<void> {
    const team = await this.PickAndDrawTeamRepository.findOne({
      where: {
        header: { id: headerId },
        healer: { id: healerId },
        roping: { id: ropingId },
      },
      relations: ['header', 'healer', 'roping'],
    });

    if (!team) {
      throw new NotFoundException(
        'Team with the specified header and healer in this roping not found',
      );
    }

    // Remove the team
    await this.PickAndDrawTeamRepository.remove(team);

    // Delete draw entries for the header of the deleted team
    await this.drawEntriesRepository.delete({
      roping: { id: ropingId },
      contestant: { id: headerId },
    });

    // Delete draw entries for the healer of the deleted team
    await this.drawEntriesRepository.delete({
      roping: { id: ropingId },
      contestant: { id: healerId },
    });
  }

  async findTeamsByRopingId(ropingId: number): Promise<PickAndDrawTeam[]> {
    const teams = await this.PickAndDrawTeamRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['header', 'healer', 'roping'],
    });

    if (teams.length === 0) {
      throw new NotFoundException(`No teams found for this roping `);
    }

    return teams;
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
  ): Promise<PickAndDrawTeam[]> {
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
    const uniqueTeams: PickAndDrawTeam[] = [];
    const usedHeaders = new Set<string>();
    const usedHealers = new Set<string>();

    const specificRoping = await this.ropingRepository.findOne({
      where: { id: ropingId },
    });

    for (const { header, healer } of specificTeams) {
      // Check if the pair already exists in the team table
      const existingPair = await this.PickAndDrawTeamRepository.findOne({
        where: {
          header: { id: header.contestant.id },
          healer: { id: healer.contestant.id },
          roping: { id: ropingId },
        },
      });

      if (existingPair) {
        throw new BadRequestException(
          'This pair of header and healer already exists in the team now add new contestant 1.',
        );
      }

      const team = this.PickAndDrawTeamRepository.create({
        header: header.contestant,
        healer: healer.contestant,
        roping: specificRoping,
        checkTeams: false,
      });
      uniqueTeams.push(team);
      usedHeaders.add(header.contestant.id.toString());
      usedHealers.add(healer.contestant.id.toString());
    }

    // Shuffle the remaining headers and healers to ensure random pairing each time
    this.shuffleArray(remainingHeaders);
    this.shuffleArray(remainingHealers);

    const possibleRemainingTeams: {
      header: DrawEntries;
      healer: DrawEntries;
    }[] = [];
    // console.log(remainingHeaders)
    // console.log(remainingHealers)
    // Generate all valid teams
    for (const remsH of remainingHeaders) {
      for (const healer of remainingHealers) {
        if (remsH.header_rating + healer.healer_rating <= classification) {
          possibleRemainingTeams.push({ header: remsH, healer: healer });
        }
      }
    }
    console.log('possible teas', possibleRemainingTeams.length);

    // Step 2: Remove existing teams from possibleTeams
    const existingTeams = await this.PickAndDrawTeamRepository.find({
      where: {
        roping: { id: ropingId },
      },
      relations: ['header', 'healer'],
    });

    const existingPairs = new Set(
      existingTeams.map((team) => `${team.header.id}-${team.healer.id}`),
    );

    const filteredPossibleTeams = possibleRemainingTeams.filter(
      (team) =>
        !existingPairs.has(
          `${team.header.contestant.id}-${team.healer.contestant.id}`,
        ),
    );
    console.log("length: ",filteredPossibleTeams.length)

    // Step 3: Shuffle and save filtered possible teams
    // this.shuffleArray(filteredPossibleTeams);

    // Randomly pair remaining headers and healers
    // while (remainingHeaders.length > 0 && remainingHealers.length > 0) {
    //   const header = remainingHeaders.pop();
    //   const healer = remainingHealers.pop();

    //   if (
    //     header &&
    //     healer &&
    //     header.header_rating + healer.healer_rating <= classification
    //   ) {
    //     // // Check if the pair already exists in the team table
    //     // const existingPair = await this.PickAndDrawTeamRepository.findOne({
    //     //   where: {
    //     //     header: { id: header.contestant.id },
    //     //     healer: { id: healer.contestant.id },
    //     //     roping: { id: ropingId },
    //     //   },
    //     // });

    //     // if (existingPair) {
    //     //   throw new BadRequestException(
    //     //     'This pair of header and healer already exists in the team now add new contestant 2.',
    //     //   );
    //     // }

    //     const team = this.PickAndDrawTeamRepository.create({
    //       header: header.contestant,
    //       healer: healer.contestant,
    //       roping: specificRoping,
    //       checkTeams: false,
    //     });
    //     uniqueTeams.push(team);
    //     usedHeaders.add(header.contestant.id.toString());
    //     usedHealers.add(healer.contestant.id.toString());
    //   }
    // }

    const usedRemainingHeaders = new Set<string>();
    const usedRemainingHealers = new Set<string>();

for (const { header, healer } of filteredPossibleTeams) {
  if (
    !usedRemainingHeaders.has(header.contestant.id.toString()) &&
    !usedRemainingHealers.has(healer.contestant.id.toString())
  ) {
    const team = this.PickAndDrawTeamRepository.create({
      header: header.contestant,
      healer: healer.contestant,
      roping: specificRoping,
      checkTeams: false
    });
    uniqueTeams.push(team);
    usedRemainingHeaders.add(header.contestant.id.toString());
    usedRemainingHealers.add(healer.contestant.id.toString());
  }
}

    if (uniqueTeams.length === 0) {
      throw new BadRequestException(
        'no more teams can be created as per the draw',
      );
    }

    if (uniqueTeams.length < headers.length) {
      console.log(uniqueTeams);
    console.log('suffel', filteredPossibleTeams);

      throw new BadRequestException(
        'Cannot create teams: Not all headers or healers can be paired within the given classification.',
      );
    }

    return this.PickAndDrawTeamRepository.save(uniqueTeams);
  }

  async deleteTeamsByRopingId(ropingId: number): Promise<void> {
    // Find teams with the given roping ID and checkTeams set to false
    const teamsToDelete = await this.PickAndDrawTeamRepository.find({
      where: { roping: { id: ropingId }, checkTeams: false },
    });

    if (!teamsToDelete || teamsToDelete.length === 0) {
      throw new NotFoundException(
        `No teams found for roping ID ${ropingId} with checkTeams set to false`,
      );
    }

    // Delete the found teams
    await this.PickAndDrawTeamRepository.remove(teamsToDelete);
  }
}