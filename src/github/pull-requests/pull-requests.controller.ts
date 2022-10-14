import { Body, Controller, Get, Post } from '@nestjs/common';
import { PullRequestsService } from './pull-requests.service';

@Controller('pull-requests')
export class PullRequestsController {
    constructor(private readonly pullRequestsService: PullRequestsService){}
    @Post()
     async getPullRequests(@Body('githubUrl') url:string): Promise<any> {
        return this.pullRequestsService.getPullRequests(url);
    }

}
