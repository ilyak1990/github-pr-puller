import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GithubModule } from '../src/github/github.module';
import { PullRequestsService } from '../src/github/pull-requests/pull-requests.service';

describe('PullRequests', () => {
  let app: INestApplication;
  let prService = { getPullRequests: () => ['test'] };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GithubModule],
      providers:[]
    })
      .overrideProvider(PullRequestsService)
      .useValue(prService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET pull-requests`,async () => {
    const postRequest =await request(app.getHttpServer()).get('/pull-requests?githubUrl=https://github.com/aws/aws-sdk-go')
    expect(postRequest.statusCode).toEqual(200)
    expect(postRequest.body).toEqual(
      prService.getPullRequests()
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
