import { Body, Controller, Delete, Post } from '@nestjs/common';
import { TablesService } from '../tables/tables.service';
import { composeError } from '../compose';
import { ICreateDatabase, ICreateTable, IName } from '../interfaces';
import {
  validateCreateDatabase,
  validateCreateTable,
  validateString,
} from '../validators';
import { DatabaseService } from './database.service';
import { checkDatabase } from '../libs/database';

@Controller('database')
export class DatabaseController {
  constructor(private ds: DatabaseService, private ts: TablesService) {}
  @Post('create')
  createDatabase(@Body() create: ICreateDatabase) {
    const st = new Date();
    try {
      validateCreateDatabase(create);
      const res = this.ds.createDatabase(create);
      if (res.status === 'success') {
        const tables = create.tables;
        if (tables === null || tables === undefined) return res;
        else if (tables.length === 0) return res;
        else
          tables.forEach((v: ICreateTable) => {
            validateCreateTable(v);
            if (!checkDatabase(v.database.name))
              throw new Error('Database does not exist.');
            this.ts.createTable(v);
          });
      }
      return res;
    } catch (e) {
      return composeError(e.message, st);
    }
  }
  @Delete('')
  DeleteDatabase(@Body() create: IName) {
    const st = new Date();
    try {
      validateString(create.name);
      return this.ds.deleteDatabase(create);
    } catch (e) {
      return composeError(e.message, st);
    }
  }
}
