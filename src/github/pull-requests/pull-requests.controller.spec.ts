import { Test, TestingModule } from '@nestjs/testing';
import { PullRequestsController } from './pull-requests.controller';
import { PullRequestsService } from './pull-requests.service';

describe('PullRequestsController', () => {
  let controller: PullRequestsController;
  const prService = {
    getPullRequests: jest.fn().mockResolvedValue('response'),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PullRequestsController],
      providers: [{ provide: PullRequestsService, useValue: prService }],
    }).compile();

    controller = module.get<PullRequestsController>(PullRequestsController);
  });

  it('should return value to endpoint', async () => {
    const returnedPromise = await controller.getPullRequests('dummy-url');
    expect(returnedPromise).toEqual('response');
  });
});
