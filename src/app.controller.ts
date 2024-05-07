import { Controller, Get, Request as Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from './auth/jwt-auth.guard';

// http://localhost:3000/global
@ApiTags('Global')
@Controller('global')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // http://localhost:3000/global/docs
  @Public()
  @Get('docs')
  getDocs(@Req() request: Request): string {
    console.log('request.body: ', request.body);
    console.log('request.query: ', request.query);
    console.log("request.query['v']: ", request.query['v']);
    // console.log('request.ip: ', request.ip);
    return this.appService.getDocs();
  }
}
