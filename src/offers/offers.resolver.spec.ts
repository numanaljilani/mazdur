import { Test, TestingModule } from '@nestjs/testing';
import { OffersResolver } from './offers.resolver';

describe('OffersResolver', () => {
  let resolver: OffersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffersResolver],
    }).compile();

    resolver = module.get<OffersResolver>(OffersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
