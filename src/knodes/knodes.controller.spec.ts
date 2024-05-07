import { Test, TestingModule } from '@nestjs/testing';
import { KnodesController } from './knodes.controller';
import { KnodesService } from './knodes.service';

describe('KnodesController', () => {
  let controller: KnodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnodesController],
      providers: [KnodesService],
    }).compile();

    controller = module.get<KnodesController>(KnodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
