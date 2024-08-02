import { Test, TestingModule } from '@nestjs/testing';
import { ContestantService } from './contestant.service';

describe('ContestantService', () => {
  let service: ContestantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContestantService],
    }).compile();

    service = module.get<ContestantService>(ContestantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
