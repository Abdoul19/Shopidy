import { Injectable, Dependencies } from '@nestjs/common';
import { MagentoWrapperService } from '../magento-wrapper/magento-wrapper.service'
import {RequestParser} from '../magento-wrapper/requestParser'
import { LoggerService } from '../logger/logger.service';

@Dependencies(MagentoWrapperService)
@Injectable()
export class StoreService {
  constructor(magentoWrapperService){
    this.logger = new LoggerService('StoreService');
    this.magentoClient = magentoWrapperService;
    this.parser = new RequestParser;
  }

  async getCategories(){
    return new Promise((resolve, reject) => {
      this.magentoClient.get('categories?fields=children_data').then((data) => {
        resolve(data);
      }).catch((e) => reject(e));
    });
  }

  async getCategoriesProducts(categorieId, request){
    return new Promise((resolve, reject) => {
      if(isNaN(categorieId)){
        reject('Categorie id must be number')
      }
      const filter = this.parser.parse(request)
      this.magentoClient.get(`categories/${categorieId}/products?${filter}`).then((data) => {
        console.log(data.length)
        resolve(data);
      }).catch((e) => reject(e));
    });
  }

  async getProducts(sku){
    return new Promise((resolve, reject) => {
      this.magentoClient.get(`products/${sku}?`).then((data) => {
        console.log(data.length)
        resolve(data);
      }).catch((e) => reject(e));
    });
  }

  async productsSearch(request){

    return new Promise((resolve, reject) => {
      const filters = this.parser.parse(request);

      this.magentoClient.get(`products?${filters}`).then((data) => {
        console.log(data.length)
        resolve(data);
      }).catch((e) => reject(e));
    });
  }
}
