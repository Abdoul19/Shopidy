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
    const params = {
      $from: "2019-08-03 11:22:47",
      $to: "2020-08-03 11:22:47",
      $sort: {
          "created_at": "desc"
      },
      $perPage: 200,
      $page: 1
    }
     //return 'Hello World';
    
  }

  createSortFilter(field, direction){
    return {
      field: field,
      direction: direction
    }
  }

  createRangeFilter(field, valueFrom, valueTo){
    const from = {
      field: field,
      value: valueFrom,
      condition_type: 'from',
    };

    const to = {
      field: field,
      value: valueTo,
      condition_type: 'to',
    };

    return { from, to};
  }


  createFilter(field, value, conditionType){
    return {
      field: field.toString(),
      value: value.toString(),
      condition_type: conditionType.toString(),
    }
  }



}
