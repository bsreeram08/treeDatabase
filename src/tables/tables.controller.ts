import { Body, Controller, Delete, Post } from '@nestjs/common';
import { getFromLru } from '../libs/cache';
import { composeError, composeSuccess } from '../compose';
import {
  ICreateTable,
  IQuery,
  IStatus,
  ITable,
  Operation,
} from '../interfaces';
import { checkDatabase, checkTable } from '../libs/database';
import {
  validateCreateTable,
  validateQuery,
  validateTable,
} from '../validators';
import { TablesService } from './tables.service';

@Controller('table')
export class TablesController {
  constructor(private ts: TablesService) {}
  @Post('create')
  createTable(@Body() table: ICreateTable): IStatus {
    const st = new Date();
    try {
      validateCreateTable(table);
      if (!checkDatabase(table.database.name)) {
        throw new Error('Database does not exist.');
      }
      return this.ts.createTable(table);
    } catch (e) {
      return composeError(e.message, st);
    }
  }

  @Delete()
  deleteTable(@Body() table: ITable): IStatus {
    const st = new Date();
    try {
      validateTable(table);
      if (!checkDatabase(table.database.name))
        throw new Error('Database does not Exist.');
      if (!checkTable(table.name, table.database.name))
        throw new Error('Table does not Exist.');
      return this.ts.deleteTable(table);
    } catch (e) {
      return composeError(e.message, st);
    }
  }

  @Post('query')
  execQuery(@Body() query: IQuery): IStatus {
    const st = new Date();
    try {
      validateQuery(query);
      if (!checkDatabase(query.database.name))
        throw new Error('Database does not exist.');
      if (!checkTable(query.table.name, query.database.name))
        throw new Error('Table does not exist.');
      const querySelector: Operation = query.operation;
      if (querySelector === 'read') {
        const resFromLru = getFromLru(query);
        if (
          resFromLru != null &&
          resFromLru != undefined &&
          resFromLru.length !== 0
        ) {
          return composeSuccess('Data fetched from Cache', st, {
            data: { read: JSON.parse(resFromLru) },
          });
        }
      }
      switch (querySelector) {
        case 'create':
          return this.ts.create(query);
        case 'read':
          return this.ts.readData(query);
        case 'update':
          return this.ts.updateData(query);
        default:
          throw new Error(
            `Unknown Operation (${querySelector}), this is not supported by the Database.`,
          );
      }
    } catch (e) {
      return composeError(e.message, st);
    }
  }
}
