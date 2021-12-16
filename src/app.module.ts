import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [DatabaseModule, TablesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
