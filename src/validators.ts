import {
  ICreateDatabase,
  ICreateTable,
  IEntries,
  IQuery,
  ITable,
  Operation,
  OperationAsArray,
  supportedTypesAsArray,
} from './interfaces';

export function validateString(str: string): string[] {
  const errors: string[] = [];
  if (typeof str != 'string') errors.push('Must be of type String');
  if (!str && typeof str != 'boolean') {
    errors.push('Must not be empty.');
    return errors;
  }
  if (str.length === 0)
    errors.push('Must be of valid length and not equal to zero.');
  if (str.length > 99999)
    errors.push('Must be of valid length and less than 99999');
  return errors;
}

export function validateCreateDatabase(c: ICreateDatabase): void {
  const nameErrors = validateDatabase(c);
  if (nameErrors.length > 0)
    throw new Error(
      `Database Name must comply with : [${nameErrors.join(',')}]`,
    );
}

export function validateDatabase(d: ICreateDatabase): string[] {
  if (validateObject(d)) return ['Database Must not be empty.'];
  return validateString(d.name);
}

export function validateObject(v: any): boolean {
  return !v || v === null || v === undefined || Object.keys(v).length === 0;
}

export function validateArrays(v: any[]): boolean {
  return !v || v === null || v === undefined;
}

export function validateCreateTable(t: ICreateTable): void {
  if (validateObject(t))
    throw new Error('Create table does not have any input to process.');
  if (validateArrays(t.entries))
    throw new Error(
      'Entries of the table expect a value, must not be left undefined',
    );
  const nameErrors: string[] = validateString(t.name);
  const databaseNameError: string[] = validateDatabase(t.database);
  if (t.entries.length === 0)
    throw new Error('Entries cannot be an empty list.');
  const entriesError: string[] = t.entries
    .map(v => validateEntries(v).join(','))
    .filter(v => v.length != 0);
  const errors = [...nameErrors, ...databaseNameError, ...entriesError];
  if (errors.length > 0)
    throw new Error(`Create Table  must comply with : [${errors.join(',')}]`);
}

export function validateTable(t: ITable): void {
  if (validateObject(t))
    throw new Error('Create table does not have any input to process.');
  const nameErrors: string[] = validateString(t.name);
  const databaseNameError: string[] = validateDatabase(t.database);
  const errors = [...nameErrors, ...databaseNameError];
  if (errors.length > 0)
    throw new Error(
      `Cannot Validate the table, must comply with : [${errors.join(',')}]`,
    );
}

export function validateEntries(e: IEntries): string[] {
  if (validateObject(e)) throw new Error('Entry must be present to process');
  const errors: string[] = [];
  const nameErrors = validateString(e.name);
  const typeError = supportedTypesAsArray.indexOf(e.type);
  if (nameErrors.length > 0)
    errors.push(`Entry name does not comply with : [${nameErrors.join(',')}]`);
  if (typeError === -1)
    errors.push(
      `Type must comply with any of the supported type : [${supportedTypesAsArray.join(
        ',',
      )}]`,
    );
  return errors;
}

export function validateQuery(query: IQuery) {
  if (!query) throw new Error('Query must be present to process.');
  if (validateObject(query.database))
    throw new Error('Database Name Must be present to process.');
  if (validateObject(query.table))
    throw new Error('Table name must be present to process.');
  if (validateObject(query.query))
    throw new Error('Query Must be present to process.');
  const dbNameError = validateString(query.database.name);
  const tableNameError = validateString(query.table.name);
  const queryTypeError = validateString(query.operation);
  const queryValidator = validateQueryOperation(query.operation);
  const errors: string[] = [
    ...dbNameError,
    ...tableNameError,
    ...queryTypeError,
    ...queryValidator,
  ];
  if (errors.length > 0)
    throw new Error(
      `Cannot process the query for the request, the query must comply with : [${errors.join(
        ',',
      )}]`,
    );
}

export function validateQueryOperation(o: Operation) {
  const errors: string[] = [];
  if (OperationAsArray.indexOf(o) === -1)
    errors.push(
      `Operation in the query not found. Check if the operation is one of : [${OperationAsArray.join(
        ',',
      )}]`,
    );
  return errors;
}
