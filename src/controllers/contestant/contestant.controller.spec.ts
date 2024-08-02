import { Test, TestingModule } from '@nestjs/testing';
import { ContestantController } from './contestant.controller';

describe('ContestantController', () => {
  let controller: ContestantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContestantController],
    }).compile();

    controller = module.get<ContestantController>(ContestantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
