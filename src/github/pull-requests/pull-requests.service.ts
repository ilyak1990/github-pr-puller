import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { PullRequest } from './pull-request.model';
import { UrlConstructorService } from '../helper/url-constructor/url-constructor.service';
@Injectable()
export class PullRequestsService {
  constructor(
    private readonly httpService: HttpService,
    private urlService: UrlConstructorService,
  ) {}
  async getPullRequests(url: string) {
    //assuming url will change per environment, did this so i didnt hardcode
    const pullsUrl = this.urlService.constructPullRequestUrl(url);
    if (pullsUrl instanceof Error) {
      throw new BadRequestException(pullsUrl.message);
    }
    try {
      const { data } = await firstValueFrom(this.httpService.get(pullsUrl));
      const pullRequests = await Promise.all(
        data.map(async (pr: any) => {
          try {
            //doesn't make sense to not have a commit with a pr but i ran accross one repo that had missing commit links
            if (!pr?._links) {
              return new PullRequest(
                pr.id,
                pr.number,
                pr.title,
                pr.user.login,
                'N/A',
              );
            }
            const commits = await firstValueFrom(
              this.httpService.get(pr._links.commits?.href),
            );
            return new PullRequest(
              pr.id,
              pr.number,
              pr.title,
              pr.user.login,
              commits?.data.length,
            );
          } catch (err) {
            return new PullRequest(
              pr.id,
              pr.number,
              pr.title,
              pr.user.login,
              'N/A',
            );
          }
        }),
      );
      return pullRequests;
    } catch (err) {
      throw new InternalServerErrorException(
        'Error fetching github repository, please make sure the repo exists and is not private.',
      );
    }
  }
}
