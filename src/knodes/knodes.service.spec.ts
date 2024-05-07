import { Test, TestingModule } from '@nestjs/testing';
import { KnodesService } from './knodes.service';

describe('KnodesService', () => {
  let service: KnodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnodesService],
    }).compile();

    service = module.get<KnodesService>(KnodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
