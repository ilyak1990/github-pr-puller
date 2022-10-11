import { HttpService } from '@nestjs/axios';
import { Injectable, Res } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, lastValueFrom, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PullRequest } from './pull-request.model';

@Injectable()
export class PullRequestsService {
    constructor(private readonly httpService: HttpService) { }
    async getPullRequests() {
        let highLevelPrs: PullRequest[] = []
        //look up e2e vs unit vs integration testing
        //focus on error handling and 
        //documentation

        //get all open prs
        ////repos/{owner}/{repo}/pulls (only open ones)
        // commits_url << count of commits can be found here

        //https://api.github.com/repos/aws/amazon-sagemaker-examples      <<repo


        //https://api.github.com/repos/aws/amazon-sagemaker-examples/pulls   << that same repos pulls
        //https://api.github.com/repos/aws/amazon-sagemaker-examples/pulls/3618/commits   <<per id pull all commits

        //user would give: https://github.com/ilyak1990/myrna-method then chop it up to call api

        //const pullsUrl = 'https://api.github.com/repos/uuidjs/uuid/pulls';
        const pullsUrl = 'https://api.github.com/repos/aws/aws-sdk-go/pulls'
        try {
            let pullRequests = this.httpService.get(pullsUrl)
                .pipe(
                    map(async (response: AxiosResponse) => {
                        return await new Promise(async (resolve, reject) => {
                            for await (const pr of response.data) {
                                if (pr?._links) {
                                    let commits = await lastValueFrom(this.httpService.get(pr?._links?.commits?.href))
                                    highLevelPrs.push(new PullRequest(pr.id, pr.number, pr.title, pr.user.login, commits.data.length))
                                }
                                else {
                                    console.log(pr.id, ' doesnt have commits?!')
                                }
                            }
                            return resolve(highLevelPrs)
                        })
                    }));
            const checkResult = (await lastValueFrom(pullRequests));

            return checkResult;
        } catch (err) {
            console.log(err)
        }

    }

}
