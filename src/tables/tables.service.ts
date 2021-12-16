/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { putToLru } from 'src/libs/cache';
import { composeError, composeSuccess } from '../compose';
import {
  ICreateTable,
  IQuery,
  IStatus,
  ITable,
  ITableMetadata,
} from '../interfaces';
import {
  addDataToDb,
  createEntries,
  createTable,
  deleteTable,
  getDataFromDB,
  getTableMetadata,
  updateDatabaseMetaData,
  updateDataToDB,
} from '../libs/database';

@Injectable()
export class TablesService {
  createTable(t: ICreateTable): IStatus {
    const ct = createTable(t.database.name, t.name);
    if (!ct) {
      return composeError('Table could not be created.');
    }
    const res = createEntries(t.database.name, t.name, t.entries);
    if (res) {
      updateDatabaseMetaData(t);
      return composeSuccess('Table Created Successfully.');
    }
    return composeError('Table could not be created.');
  }

  deleteTable(t: ITable): IStatus {
    return deleteTable(t.database.name, t.name)
      ? composeSuccess('Table deleted Successfully.')
      : composeError('Table could not be deleted.');
  }
  readData(query: IQuery): IStatus {
    try {
      const database = query.database.name;
      const table = query.table.name;
      const select = query.query.select;
      const where = query.query.where;
      const metaData: ITableMetadata = getTableMetadata(database, table);
      const columns: string[] = metaData.columns.map(v => v.name);
      const selectKeys = Object.keys(select).filter(v => select[v]);
      const whereKeys = Object.keys(where);
      const isPresent =
        selectKeys.every(v => columns.includes(v)) &&
        whereKeys.every(v => columns.includes(v));
      if (!isPresent) {
        throw new Error('Not a valid query.');
      }
      let data: any[] = getDataFromDB(database, table);
      if (whereKeys.length != 0)
        data = data.filter(v => {
          let canSelect = true;
          whereKeys.forEach(u => {
            if (v[u] !== where[u]) {
              canSelect = false;
            }
          });
          return canSelect;
        });
      if (selectKeys.length != 0)
        data = data.map(v => {
          const x = {};
          selectKeys.forEach(w => {
            x[w] = v[w];
          });
          return x;
        });
      putToLru(query, JSON.stringify(data));
      return composeSuccess('Query read successfully.', {
        data: {
          read: data,
        },
      });
    } catch (e) {
      return composeError(e.message);
    }
  }
  updateData(query: IQuery): IStatus {
    try {
      const database = query.database.name;
      const table = query.table.name;
      const where = query.query.where;
      const data = query.query.update;
      const metaData: ITableMetadata = getTableMetadata(database, table);
      const columns: string[] = metaData.columns.map(v => v.name);
      const updateKeys = Object.keys(data);
      const whereKeys = Object.keys(where);
      const isPresent =
        updateKeys.every(v => columns.includes(v)) &&
        whereKeys.every(v => columns.includes(v));
      if (!isPresent) {
        throw new Error('Now a valid Query.');
      }
      updateDataToDB(database, table, data, where);
      return composeSuccess('Data Updated Successfully');
    } catch (e) {
      return composeError(e.message);
    }
  }
  create(query: IQuery): IStatus {
    try {
      const database = query.database.name;
      const table = query.table.name;
      const data = query.query.create;
      const metaData: ITableMetadata = getTableMetadata(database, table);
      const columns: string[] = metaData.columns.map(v => v.name);
      const createKeys = Object.keys(data);
      const isPresent = createKeys.every(v => columns.includes(v));
      if (!isPresent) {
        throw new Error('Now a valid Query.');
      }
      addDataToDb(database, table, data);
      return composeSuccess('Data Created Successfully');
    } catch (e) {
      return composeError(e.message);
    }
  }
}
