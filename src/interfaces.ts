import { LRUCache } from './libs/lru';

export interface ICreateDatabase extends IName {
  tables?: ICreateTable[];
}

export interface ICreateTable extends ITable {
  entries: IEntries[];
}

export interface ITable extends IName {
  database: IName;
}

export interface IEntries extends IName {
  type: supportedTypes;
}

export interface IName {
  name: string;
}

export type supportedTypes =
  | 'string'
  | 'boolean'
  | 'number'
  | 'timestamp'
  | 'JSON';

export const supportedTypesAsArray: supportedTypes[] = [
  'JSON',
  'boolean',
  'number',
  'string',
  'timestamp',
];

export interface IStatus {
  status: 'success' | 'error';
  message: string;
  [key: string]: any;
}

export interface ITableFileEntries {
  metadata: ITableMetadata;
  rows: string[];
}

export interface IDatabaseFileEntries {
  metadata: IDatabaseMetadata;
  tables: IName[];
}

export interface IDatabaseMetadata {
  database: IName;
}

export interface ITableMetadata extends IName {
  columns: IEntries[];
}

export interface IQuery {
  operation: Operation;
  database: IName;
  table: IName;
  query: {
    select: { [key: string]: boolean };
    create: { [key: string]: any };
    update: { [key: string]: any };
    where: { [key: string]: any };
  };
}

export type Operation = 'create' | 'read' | 'update';
export const OperationAsArray: Operation[] = ['create', 'read', 'update'];

export type ICaches = {
  [key in Operation]: LRUCache;
};

export interface IQueryMatch {
  database: string;
  table: string;
  query: string;
}
