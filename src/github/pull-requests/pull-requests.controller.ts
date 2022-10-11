import { Controller, Get } from '@nestjs/common';
import { PullRequestsService } from './pull-requests.service';

@Controller('pull-requests')
export class PullRequestsController {
    constructor(private readonly pullRequestsService: PullRequestsService){}
    @Get()
     async getPullRequests(): Promise<any> {
        return await this.pullRequestsService.getPullRequests();
    }

}
