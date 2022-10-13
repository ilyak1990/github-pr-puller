import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, Res } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { PullRequest } from './pull-request.model';
import { UrlConstructorService } from '../helper/url-constructor/url-constructor.service';
@Injectable()
export class PullRequestsService {
    constructor(private readonly httpService: HttpService, private urlService: UrlConstructorService) { }
    async getPullRequests(url: string) {
        let highLevelPrs: PullRequest[] = []
        //assuming url will change per environment, did this so i didnt hardcode
        const pullsUrl = this.urlService.constructPullRequestUrl(url);
        if (pullsUrl instanceof Error) {
            throw new BadRequestException(pullsUrl.message)
        }
        try {
            let x = this.httpService.get(pullsUrl)
            console.log("okay")
            let { data } = await firstValueFrom(x)
            console.log(pullsUrl, 'pulls url')

            let pullRequests = await new Promise(async (resolve) => {
                console.log("??", data)
                for await (const pr of data) {
                    console.log("***************")
                    console.log(pr)
                    if (pr?._links) {
                        try {
                            let commits = await firstValueFrom(this.httpService.get(pr._links.commits?.href))
                            highLevelPrs.push(new PullRequest(pr.id, pr.number, pr.title, pr.user.login, commits?.data.length))
                        }
                        catch (err) {
                            highLevelPrs.push(new PullRequest(pr.id, pr.number, pr.title, pr.user.login, "N/A"))
                        }

                    }
                }
                resolve(highLevelPrs)
            })
            return await pullRequests;
        } catch (err) {
            throw new InternalServerErrorException("Error fetching github repository, please make sure the repo exists and is not private.")
        }

    }

}
