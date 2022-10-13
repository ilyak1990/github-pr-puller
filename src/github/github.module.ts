import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { getEnvPath } from 'src/common/helper/env.helper';
import { UrlConstructorService } from './helper/url-constructor/url-constructor.service';
import { PullRequestsController } from './pull-requests/pull-requests.controller';
import { PullRequestsService } from './pull-requests/pull-requests.service';

//can use a config.ts to return an object eventually, kept simple for this project

const envFilePath: string = getEnvPath(`${process.cwd()}/dist/common/envs`);
@Module({
    imports: [HttpModule, ConfigModule.forRoot({
        envFilePath: envFilePath, isGlobal: true
    })],
    controllers: [PullRequestsController],
    providers: [PullRequestsService, UrlConstructorService]
})
//barring there would be more than just pull request services/controllers    
export class GithubModule { }
