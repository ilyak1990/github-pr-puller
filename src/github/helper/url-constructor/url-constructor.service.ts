import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlConstructorService {

    constructor(private configService: ConfigService) { }
    //barring there will be other url manipulation
    constructPullRequestUrl(url: string) {
        //personally would ask user give repo / user in different attributes of post object but since requirements say "github URL provided by user" will parse it out
        if (!url.includes("https://github.com/")) {
            console.log("not valid")
            return Error("not a valid github URL");
        }
        let githubUrl = this.configService.get<string>('github_url')
        let user: string
        let repo: string
        try {
            console.log("in try")
            let userAndRepo = url.split("https://github.com/")[1]
            let splitUrl = userAndRepo.split("/")
            user = splitUrl[0]
            repo = splitUrl[1]
        }
        catch (err) {
            console.log("in catch")
            return Error(err);
        }

        return `${githubUrl}repos/${user}/${repo}/pulls`

    }
}
