import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { mongodbConfig } from './mongodb.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseConfigService.name);

  constructor(
    @Inject(mongodbConfig.KEY)
    private readonly mongoConfig: ConfigType<typeof mongodbConfig>,
  ) {}

  createMongooseOptions(): MongooseModuleOptions {
    this.logger.log(`uri: ${this.mongoConfig.uri}`);

    return {
      uri: this.mongoConfig.uri,
    };
  }
}
