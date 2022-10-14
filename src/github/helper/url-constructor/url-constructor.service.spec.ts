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

  it('should return full valid url', () => {
    const returnedUrl = service.constructPullRequestUrl(
      'https://github.com/user/repo',
    );
    expect(returnedUrl).toEqual('https://api.github.com/repos/user/repo/pulls');
  });
  it('should return error from catch', () => {
      jest.spyOn(String.prototype, 'split').mockReturnValueOnce(null);
    const returnedUrl = service.constructPullRequestUrl('https://github.com/');
    expect(returnedUrl).toEqual(
      new Error("TypeError: Cannot read property '1' of null"),
    );
  });
  it('should return error with incorrect url', () => {
    const returnedUrl = service.constructPullRequestUrl('https://blah.com');
    expect(returnedUrl).toEqual(new Error('not a valid github URL'));
  });
});
