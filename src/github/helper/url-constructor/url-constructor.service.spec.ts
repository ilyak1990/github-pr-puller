import { Test, TestingModule } from '@nestjs/testing';
import { UrlConstructorService } from './url-constructor.service';

describe('UrlConstructorService', () => {
  let service: UrlConstructorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlConstructorService],
    }).compile();

    service = module.get<UrlConstructorService>(UrlConstructorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
