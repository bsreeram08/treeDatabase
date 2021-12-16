import { Injectable } from '@nestjs/common';
import { putToLru } from '../libs/cache';
import { composeError, composeSuccess } from '../compose';
import {
  ICreateTable,
  IEntries,
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
    const st = new Date();
    const ct = createTable(t.database.name, t.name);
    if (!ct) return composeError('Table could not be created.', st);

    const res = createEntries(t.database.name, t.name, t.entries);
    if (res) {
      updateDatabaseMetaData(t);
      return composeSuccess('Table Created Successfully.', st);
    }
    return composeError('Table could not be created.', st);
  }

  deleteTable(t: ITable): IStatus {
    const st = new Date();
    return deleteTable(t.database.name, t.name)
      ? composeSuccess('Table deleted Successfully.', st)
      : composeError('Table could not be deleted.', st);
  }
  readData(query: IQuery): IStatus {
    const st = new Date();
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
      if (!isPresent) throw new Error('Not a valid query.');

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
      return composeSuccess('Query read successfully.', st, {
        data: {
          read: data,
        },
      });
    } catch (e) {
      return composeError(e.message, st);
    }
  }
  updateData(query: IQuery): IStatus {
    const st = new Date();
    try {
      const database = query.database.name;
      const table = query.table.name;
      const where = query.query.where;
      const data = query.query.update;
      const metaData: ITableMetadata = getTableMetadata(database, table);
      const columns: IEntries[] = metaData.columns.map(v => v);
      const columnName = columns.map(v => v.name);
      const updateKeys = Object.keys(data);
      const whereKeys = Object.keys(where);
      const isPresent =
        updateKeys.every(v => columnName.includes(v)) &&
        whereKeys.every(v => columnName.includes(v));
      if (!isPresent) throw new Error('Not a valid Query.');
      let valid = true;
      columns
        .filter(v => updateKeys.includes(v.name))
        .forEach(v => {
          if (typeof data[v.name] !== v.type) {
            valid = false;
          }
        });
      if (!valid)
        throw new Error(`Query is valid but the types of params don't match`);
      updateDataToDB(database, table, data, where);
      return composeSuccess('Data Updated Successfully', st);
    } catch (e) {
      return composeError(e.message, st);
    }
  }
  create(query: IQuery): IStatus {
    const st = new Date();
    try {
      const database = query.database.name;
      const table = query.table.name;
      const data = query.query.create;
      const metaData: ITableMetadata = getTableMetadata(database, table);
      const columns: IEntries[] = metaData.columns.map(v => v);
      const columnName: string[] = columns.map(v => v.name);
      const createKeys = Object.keys(data);
      const isPresent = createKeys.every(v => columnName.includes(v));
      if (!isPresent) throw new Error('Now a valid Query.');
      let valid = true;
      columns
        .filter(v => createKeys.includes(v.name))
        .forEach(v => {
          if (typeof data[v.name] !== v.type) {
            valid = false;
          }
        });
      if (!valid)
        throw new Error(`Query is valid but the types of params don't match`);
      addDataToDb(database, table, data);
      return composeSuccess('Data Created Successfully', st);
    } catch (e) {
      return composeError(e.message, st);
    }
  }
}
