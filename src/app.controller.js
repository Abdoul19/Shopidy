import { Controller, Dependencies, Get, Post, Body, Bind } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service'

@Controller()
@Dependencies(AppService)
export class AppController {
  constructor(appService) {
    this.logger = new LoggerService('AppController');
    this.appService = appService;
  }

  @Get()
  getHello() {
    
    //return 'Hello World';
    
  }

  
}
