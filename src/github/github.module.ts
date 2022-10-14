import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UrlConstructorService } from './helper/url-constructor/url-constructor.service';
import { PullRequestsController } from './pull-requests/pull-requests.controller';
import { PullRequestsService } from './pull-requests/pull-requests.service';

@Module({
  imports: [HttpModule],
  controllers: [PullRequestsController],
  providers: [PullRequestsService, UrlConstructorService],
})
//barring there would be more than just pull request services/controllers
export class GithubModule {}
