import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePickOnlyTeamDto } from "src/dto/createpickonly-team.dto";
import { Contestant } from "src/models/contestant.entity";
import { PickonlyTeam } from "src/models/pickonly-team.entity";
import { Roping } from "src/models/roping.entity";
import { Repository } from "typeorm";







@Injectable()
export class PickOnlyTeamservice {
  constructor(
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
    @InjectRepository(PickonlyTeam)
    private readonly teamRepository: Repository<PickonlyTeam>,
    @InjectRepository(Roping)
    private readonly ropingRepository: Repository<Roping>,
  ) {}

  async createPickOnlyTeam(
    createTeamDto: CreatePickOnlyTeamDto,
  ): Promise<PickonlyTeam> {
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

    // Check if the sum of header and healer ratings is within the classification
    if (headerRating + healerRating > classification) {
      throw new BadRequestException(
        `The sum of header rating and healer rating exceeds the classification (${classification}), no team will be created.`,
      );
    }

    // Check if header or healer is already in any team
    const existingTeams = await this.teamRepository.find({
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
    const team = this.teamRepository.create({
      header,
      healer,
      roping,
    });

    const savedTeam = await this.teamRepository.save(team);
    console.log('Created team:', savedTeam);

    return savedTeam;
  }

  async findTeamsByRopingId(ropingId: number): Promise<PickonlyTeam[]> {
    const teams = await this.teamRepository.find({
      where: { roping: { id: ropingId } },
      relations: ['header', 'healer', 'roping'],
    });

    if (teams.length === 0) {
      throw new NotFoundException(`No teams found for roping `);
    }

    return teams;
  }

  async deleteTeam(headerId: number, healerId: number, ropingId: number): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: {
        header: { id: headerId },
        healer: { id: healerId },
        roping: { id: ropingId },
      },
    });

    if (!team) {
      throw new NotFoundException('Team with the specified header and healer in this roping not found');
    }

    await this.teamRepository.remove(team);
  }


  
  
}
