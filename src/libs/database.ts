import * as fs from 'fs';
import {
  ICreateTable,
  IDatabaseFileEntries,
  IEntries,
  IName,
  ITableFileEntries,
} from '../interfaces';
import { environment } from '../environment';
import { Logger } from '@nestjs/common';
import { calculateTimeTaken } from './metrics';
const logger = new Logger('Database Service');

export function createDatabase(
  name: string,
  md: IDatabaseFileEntries,
): boolean {
  const startTime = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${name}`;
  const fileMetadata = `${dir}/metadata.json`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.writeFileSync(fileMetadata, JSON.stringify(md), { flag: 'wx' });
    calculateTimeTaken(startTime, logger, 'Create Database');
    return true;
  }
  calculateTimeTaken(startTime, logger, 'Create Database');
  return false;
}

export function checkDatabase(name: string): boolean {
  const dir = `./${environment.rootDatabaseDirectory}/${name}`;
  return fs.existsSync(dir);
}

export function checkTable(name: string, dbName: string): boolean {
  const dir = `./${environment.rootDatabaseDirectory}/${dbName}/${name}`;
  return fs.existsSync(dir);
}

export function deleteDatabase(name: string): boolean {
  const st = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${name}`;
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, {
      recursive: true,
    });
    calculateTimeTaken(st, logger, 'Delete Database');
    return true;
  }
  calculateTimeTaken(st, logger, 'Delete Database');
  return false;
}

export function createTable(dbName: string, name: string): boolean {
  const st = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${dbName}/${name}`;
  const file = `${dir}/${name}.json`;
  const fileMetadata = `${dir}/metadata.json`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, '', { flag: 'wx' });
    fs.writeFileSync(fileMetadata, '', { flag: 'wx' });
    calculateTimeTaken(st, logger, 'Create Table');
    return true;
  }
  calculateTimeTaken(st, logger, 'Create Table');
  return false;
}

export function deleteTable(dbName: string, name: string): boolean {
  const st = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${dbName}/${name}`;
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
    calculateTimeTaken(st, logger, 'Delete Table');
    return true;
  }
  calculateTimeTaken(st, logger, 'Delete Table');
  return false;
}

export function createEntries(
  dbName: string,
  name: string,
  entries: IEntries[],
): boolean {
  const st = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${dbName}/${name}`;
  const file = `${dir}/${name}.json`;
  const fileMetaData = `${dir}/metadata.json`;
  entries = entries.sort((a, b) => (a.name > b.name ? 1 : -1));
  if (!fs.existsSync(file)) {
    calculateTimeTaken(st, logger, 'Create Entries');
    return false;
  }
  const composeTableEntries: ITableFileEntries = {
    rows: [],
    metadata: {
      name: name,
      columns: entries,
    },
  };
  fs.writeFileSync(file, JSON.stringify(composeTableEntries.rows));
  fs.writeFileSync(fileMetaData, JSON.stringify(composeTableEntries.metadata));
  calculateTimeTaken(st, logger, 'Create Entries');
  return true;
}

export function updateDatabaseMetaData(t: ICreateTable): boolean {
  const st = new Date();
  try {
    const tableName: IName = {
      name: t.name,
    };
    const databaseName: string = t.database.name;
    if (!checkDatabase(databaseName)) return false;
    if (!checkTable(t.name, databaseName)) return false;
    const dir = `./${environment.rootDatabaseDirectory}/${databaseName}`;
    const metaDataFile = `${dir}/metadata.json`;
    const fileData: IDatabaseFileEntries = JSON.parse(
      fs.readFileSync(metaDataFile).toString(),
    );
    fileData.tables.push(tableName);
    fs.writeFileSync(metaDataFile, JSON.stringify(fileData));
    calculateTimeTaken(st, logger, 'Update Database Meta Data');
    return true;
  } catch (e) {
    calculateTimeTaken(st, logger, 'Update Database Meta Data');
    return false;
  }
}

export function getTableMetadata(dbName: string, tableName: string) {
  const st = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${dbName}/${tableName}`;
  const metaDataFile = `${dir}/metadata.json`;
  calculateTimeTaken(st, logger, 'Get Table MetaData');
  return JSON.parse(fs.readFileSync(metaDataFile).toString());
}

export function getDataFromDB(dbName: string, tableName: string) {
  const st = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${dbName}/${tableName}`;
  const file = `${dir}/${tableName}.json`;
  calculateTimeTaken(st, logger, 'Get data from DB');
  return JSON.parse(fs.readFileSync(file).toString());
}

export function addDataToDb(
  dbName: string,
  tableName: string,
  dataToInsert: { [key: string]: string },
): boolean {
  const st = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${dbName}/${tableName}`;
  const file = `${dir}/${tableName}.json`;
  const data: any[] = getDataFromDB(dbName, tableName);
  data.push(dataToInsert);
  fs.writeFileSync(file, JSON.stringify(data));
  calculateTimeTaken(st, logger, 'Add Data to DB');
  return true;
}

export function updateDataToDB(
  dbName: string,
  tableName: string,
  dataToUpdate: { [key: string]: string },
  where: { [key: string]: string },
) {
  const st = new Date();
  const dir = `./${environment.rootDatabaseDirectory}/${dbName}/${tableName}`;
  const file = `${dir}/${tableName}.json`;
  const data: any[] = getDataFromDB(dbName, tableName);
  data.forEach((d, index) => {
    let match = true;
    Object.keys(where).forEach(v => {
      if (d[v] !== where[v]) match = false;
    });
    if (match) {
      Object.keys(dataToUpdate).forEach(v => {
        data[index][v] = dataToUpdate[v];
      });
    }
  });
  fs.writeFileSync(file, JSON.stringify(data));
  calculateTimeTaken(st, logger, 'Update Data to DB');
  return true;
}
