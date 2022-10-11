import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GithubModule } from './github/github.module';

@Module({
  imports: [HttpModule, GithubModule]
})
export class AppModule {}
