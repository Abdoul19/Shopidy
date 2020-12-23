import { Controller, Dependencies, Get, Post, Body, Bind } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service'
import qs from 'qs';

@Controller()
@Dependencies(AppService)
export class AppController {
  constructor(appService) {
    this.logger = new LoggerService('AppController');
    this.appService = appService;
  }

  @Post()
  @Bind(Body())
  getHello(data) {
     //return 'Hello World';
    
    const criterias = {};
    const filterGroup = {};
    const filters = {};

    filterGroup.filters = [];
    criterias.filter_groups = [];
    const searchObject = {}

    const { request } = data;

    if(typeof request === 'object' && request !== null)
    {
      Object.values(request).forEach((item, index, array) => {
        if(item.conditionType == 'finset'){
          
          if(item.value.includes(' ')){
            const value = item.value.split(' ').join('').toString();
            const filter = this.createFilter(item.field, value, item.conditionType);
            filterGroup.filters.push(filter);
          }else{
            const filter = this.createFilter(item.field, item.value, item.conditionType);
            filterGroup.filters.push(filter);
          }
        } else if( item.conditionType == 'finset' ){

        } else{
          const filter = this.createFilter(item.field, item.value, item.conditionType);
          filterGroup.filters.push(filter);
        }
      });
    }
    
    
    
    
    // const priceFilter = this.createFilter('price', 86, 'gt');
    // const categorieFilter = this.createFilter('categorie', '4,5,6,10,15', 'finset');

    // filters.filters = [];
    // filters.filters.push(priceFilter);
    
    // filterGroup.filters.push(priceFilter, categorieFilter);
    
    criterias.filter_groups.push(filterGroup);
    searchObject.searchCriteria = criterias;
    // searchObject.searchCriteria.push(criterias);
    
    const stringFilters = qs.stringify(searchObject, {encode: false})
    // console.log(stringFilters);
    return stringFilters;
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
