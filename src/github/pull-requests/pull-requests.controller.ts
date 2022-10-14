import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { PullRequestsService } from './pull-requests.service';

@Controller('/pull-requests')
export class PullRequestsController {
    constructor(private readonly pullRequestsService: PullRequestsService){}
    @Get()
     async getPullRequests(@Query('githubUrl') url: string): Promise<any> {
        return this.pullRequestsService.getPullRequests(url);
    }

}
