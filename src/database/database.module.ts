import { Module } from '@nestjs/common';
import { TablesService } from '../tables/tables.service';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, TablesService],
})
export class DatabaseModule {}
