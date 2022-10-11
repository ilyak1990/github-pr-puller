import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PullRequest } from './pull-requests/pull-request.model';
import { PullRequestsController } from './pull-requests/pull-requests.controller';
import { PullRequestsService } from './pull-requests/pull-requests.service';

@Module({
    imports:[HttpModule],
    controllers: [PullRequestsController],
    providers: [PullRequestsService]})
//barring there would be more than just pull request services/controllers    
export class GithubModule {}
