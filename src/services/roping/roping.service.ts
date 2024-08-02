import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRopingCompleteDto } from "src/dto/create-roping-complete.dto";
import { UpdateRopingClassificationDto } from "src/dto/update-roping-classification.dto";
import { UpdateRopingCompleteDto } from "src/dto/update-roping-complete-dto";
import { UpdateRopingFinancialsDto } from "src/dto/update-roping-financials.dto";
import { UpdateRopingRulesDto } from "src/dto/update-roping-rules.dto";
import { UpdateRopingDto } from "src/dto/update-roping.dto";
import { Production } from "src/models/production.entity";
import { RopingClassification } from "src/models/roping-classification.entity";
import { RopingFinancials } from "src/models/roping-financials.entity";
import { RopingRules } from "src/models/roping-rules.entity";
import { Roping } from "src/models/roping.entity";
import { Repository } from "typeorm";



@Injectable()
export class RopingService {
  constructor(
    @InjectRepository(Roping)
    private readonly ropingRepository: Repository<Roping>,
    @InjectRepository(RopingRules)
    private readonly ropingRulesRepository: Repository<RopingRules>,
    @InjectRepository(RopingFinancials)
    private readonly ropingFinancialsRepository: Repository<RopingFinancials>,
    @InjectRepository(RopingClassification)
    private readonly ropingClassificationRepository: Repository<RopingClassification>,
    @InjectRepository(Production)
    private readonly productionRepository: Repository<Production>,
  ) {}

  async createRoping(data: CreateRopingCompleteDto): Promise<void> {
    const {
      productionId,
      roping,
      ropingRules,
      ropingFinancials,
      ropingClassification,
    } = data;
    console.log(data);
    console.log(data.ropingRules);

    const production = await this.productionRepository.findOne({
      where: { id: productionId },
    });
    console.log(production);
    if (!production) {
      throw new Error('Production not found');
    }
    console.log(roping);
    // Create Roping
    const ropingEntity = this.ropingRepository.create({
      ...roping,
      production,
    });
    await this.ropingRepository.save(ropingEntity);

    // Create RopingRules
    const ropingRulesEntity = this.ropingRulesRepository.create({
      ...ropingRules,
      roping: ropingEntity,
    });
    await this.ropingRulesRepository.save(ropingRulesEntity);

    // Create RopingFinancials
    const ropingFinancialsEntity = this.ropingFinancialsRepository.create({
      ...ropingFinancials,
      roping: ropingEntity,
    });
    await this.ropingFinancialsRepository.save(ropingFinancialsEntity);

    // Create RopingClassification
    let ropingClassificationEntity = null;
    if (ropingClassification) {
      ropingClassificationEntity = this.ropingClassificationRepository.create({
        ...ropingClassification,
        roping: ropingEntity,
      });
      await this.ropingClassificationRepository.save(
        ropingClassificationEntity,
      );
    }
  }

  async getRopingsByProductionId(
    productionId: number,
  ): Promise<{ id: number; name: string }[]> {
    const ropings = await this.ropingRepository.find({
      where: { production: { id: productionId } },
      select: ['id', 'name'], // Select both 'id' and 'name' fields
    });
    return ropings;
  }

  async getRopingDetails(ropingId: number): Promise<{
    roping: Roping;
    ropingRules: RopingRules;
    ropingFinancials: RopingFinancials;
    ropingClassification: RopingClassification | null;
  }> {
    const roping = await this.ropingRepository.findOne({
      where: { id: ropingId },
      relations: ['ropingRules', 'ropingFinancials', 'ropingClassification'],
    });

    if (!roping) {
      throw new Error('Roping not found');
    }

    // Ensure single instances are retrieved
    const ropingRules = roping.ropingRules[0]; // Assuming there's only one ropingRules related
    const ropingFinancials = roping.ropingFinancials[0]; // Assuming there's only one ropingFinancials related
    const ropingClassification = roping.ropingClassification
      ? roping.ropingClassification[0]
      : null;

    return {
      roping,
      ropingRules,
      ropingFinancials,
      ropingClassification,
    };
  }

  async updateRoping(id: number, data: UpdateRopingCompleteDto): Promise<void> {
    const { roping, ropingRules, ropingFinancials, ropingClassification } =
      data;

    const existingRoping = await this.ropingRepository.findOne({
      where: { id },
      relations: ['ropingRules', 'ropingFinancials', 'ropingClassification'],
    });

    if (!existingRoping) {
      throw new NotFoundException('Roping not found');
    }

    // Update Roping
    this.ropingRepository.merge(existingRoping, roping);
    await this.ropingRepository.save(existingRoping);

    // Update RopingRules if exists
    if (ropingRules) {
      let existingRopingRules = await this.ropingRulesRepository.findOne({
        where: { roping: { id } },
      });

      if (existingRopingRules) {
        this.ropingRulesRepository.merge(existingRopingRules, ropingRules);
        await this.ropingRulesRepository.save(existingRopingRules);
      } else {
        const newRopingRules = this.ropingRulesRepository.create({
          ...ropingRules,
          roping: existingRoping,
        });
        await this.ropingRulesRepository.save(newRopingRules);
      }
    }

    // Update RopingFinancials if exists
    if (ropingFinancials) {
      let existingRopingFinancials =
        await this.ropingFinancialsRepository.findOne({
          where: { roping: { id } },
        });

      if (existingRopingFinancials) {
        this.ropingFinancialsRepository.merge(
          existingRopingFinancials,
          ropingFinancials,
        );
        await this.ropingFinancialsRepository.save(existingRopingFinancials);
      } else {
        const newRopingFinancials = this.ropingFinancialsRepository.create({
          ...ropingFinancials,
          roping: existingRoping,
        });
        await this.ropingFinancialsRepository.save(newRopingFinancials);
      }
    }

    // Update RopingClassification if exists
    if (ropingClassification) {
      let existingRopingClassification =
        await this.ropingClassificationRepository.findOne({
          where: { roping: { id } },
        });

      if (existingRopingClassification) {
        this.ropingClassificationRepository.merge(
          existingRopingClassification,
          ropingClassification,
        );
        await this.ropingClassificationRepository.save(
          existingRopingClassification,
        );
      } else {
        const newRopingClassification =
          this.ropingClassificationRepository.create({
            ...ropingClassification,
            roping: existingRoping,
          });
        await this.ropingClassificationRepository.save(newRopingClassification);
      }
    }
  }
}