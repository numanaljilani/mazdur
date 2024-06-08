import { Test, TestingModule } from '@nestjs/testing';
import { ContractorResolver } from './contractor.resolver';

describe('ContractorResolver', () => {
  let resolver: ContractorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractorResolver],
    }).compile();

    resolver = module.get<ContractorResolver>(ContractorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
