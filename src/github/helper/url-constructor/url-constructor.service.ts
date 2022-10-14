import { Injectable } from '@nestjs/common';

const GITHUB_URL = 'https://api.github.com/';
@Injectable()
export class UrlConstructorService {
  //barring there will be other url manipulation
  constructPullRequestUrl(url: string) {
    //would ask user give repo / user in different attributes of post object but since requirements say "github URL provided by user" will parse it out
    if (!url.includes('https://github.com/')) {
      return Error('not a valid github URL');
    }
    let user: string;
    let repo: string;
    try {
      const userAndRepo = url.split('https://github.com/')[1];
      const splitUrl = userAndRepo.split('/');
      user = splitUrl[0];
      repo = splitUrl[1];
    } catch (err) {
      return Error(err);
    }
    return `${GITHUB_URL}repos/${user}/${repo}/pulls`;
  }
}
