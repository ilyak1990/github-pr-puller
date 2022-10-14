import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { UrlConstructorService } from '../helper/url-constructor/url-constructor.service';
import { PullRequest } from './pull-request.model';
import { PullRequestsService } from './pull-requests.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('PullRequestsService', () => {
  let service: PullRequestsService;
  const incorrectPrResult: AxiosResponse = {
    data: [{ id: 1, number: 1, title: 'title', user: { login: 'user' } }],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  const prResult: AxiosResponse = {
    data: [
      {
        id: 1,
        number: 1,
        title: 'title',
        user: { login: 'user' },
        _links: { commits: { href: 'https://github-dummy-url.com/commits' } },
      },
    ],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  const commitsResult: AxiosResponse = {
    data: [{ data: 'data' }],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  const httpService = {
    get: jest.fn().mockImplementation((url) => {
      switch (url) {
        case 'https://github-dummy-url.com/commits':
          return of(commitsResult);
        default:
          return of(prResult);
      }
    }),
  };
  const urlService = {
    constructPullRequestUrl: jest
      .fn()
      .mockReturnValue('https://github-dummy-url.com'),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PullRequestsService,
        { provide: UrlConstructorService, useValue: urlService },
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = module.get<PullRequestsService>(PullRequestsService);
  });

  it('should get pull requests', async () => {
    let prs = await service.getPullRequests('https://incoming-url.com');
    expect(prs).toEqual([
      new PullRequest(1, 1, 'title', 'user', commitsResult.data.length),
    ]);
  });
  it('should error on url', async () => {
    jest
      .spyOn(urlService, 'constructPullRequestUrl')
      .mockReturnValueOnce(new Error('errored url'));
    await expect(
      service.getPullRequests('https://incoming-url.com'),
    ).rejects.toEqual(new BadRequestException('errored url'));
  });
  it('should error on original pulls call', async () => {
    jest.spyOn(httpService, 'get').mockReturnValueOnce(() => {
      return new BadRequestException('bad request coming from github');
    });
    await expect(
      service.getPullRequests('https://incoming-url.com'),
    ).rejects.toEqual(
      new InternalServerErrorException(
        'Error fetching github repository, please make sure the repo exists and is not private.',
      ),
    );
  });
  it('should error on commits call if call fails', async () => {
    jest.spyOn(httpService, 'get').mockImplementationOnce((url) => {
      if (url === 'https://github-dummy-url.com/commits') {
        return new BadRequestException(
          'bad request coming from github for commits',
        );
      }
    });
    await expect(
      service.getPullRequests('https://incoming-url.com'),
    ).rejects.toEqual(
      new InternalServerErrorException(
        'Error fetching github repository, please make sure the repo exists and is not private.',
      ),
    );
  });
  it('should error on commits call if no links in pr call', async () => {
    jest.spyOn(httpService, 'get').mockImplementation((url) => {
      if (url === 'https://github-dummy-url.com/commits') {
        return of(commitsResult);
      } else if (url === 'https://github-dummy-url.com') {
        return of(incorrectPrResult);
      }
    });
    expect(await service.getPullRequests('https://incoming-url.com')).toEqual([
      new PullRequest(1, 1, 'title', 'user', 'N/A'),
    ]);
  });
  it('should return pr with no commits from catch', async () => {
    jest.spyOn(httpService, 'get').mockImplementation((url) => {
      if (url === 'https://github-dummy-url.com/commits') {
        return of({});
      } else if (url === 'https://github-dummy-url.com') {
        return of(prResult);
      }
    });
    expect(await service.getPullRequests('https://incoming-url.com')).toEqual([
      new PullRequest(1, 1, 'title', 'user', 'N/A'),
    ]);
  });
});
