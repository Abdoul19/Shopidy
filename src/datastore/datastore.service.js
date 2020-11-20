import { Injectable, Dependencies } from '@nestjs/common';
import fortune from 'fortune';
import elasticAdapter from 'fortune-elastic-adapter';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Dependencies(ConfigService)
export class DatastoreService {
  constructor(ConfigService){
    this.configService = ConfigService;
    const datastoreHost = this.configService.get('elasticsearch').host;
    const datastorePort = this.configService.get('elasticsearch').port;
    this.datastoreAdapter = [elasticAdapter, { hosts: [ `${datastoreHost}:${datastorePort}`]}]
    this.datastore = fortune;
  }

  async createStore(recordType){
    return this.datastore(recordType, {
      adapter: this.datastoreAdapter
    })
  }
}
