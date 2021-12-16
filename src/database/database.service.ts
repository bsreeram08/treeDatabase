/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { composeError, composeSuccess } from '../compose';
import { IDatabaseFileEntries, IName } from '../interfaces';
import { createDatabase, deleteDatabase } from '../libs/database';

@Injectable()
export class DatabaseService {
  createDatabase(db: IName) {
    const st = new Date();
    const name: string = db.name;
    const md: IDatabaseFileEntries = {
      metadata: {
        database: {
          name: db.name,
        },
      },
      tables: [],
    };
    const res = createDatabase(name, md);
    return res
      ? composeSuccess('Created Database Successfully.', st)
      : composeError('Could not create the database.', st);
  }

  deleteDatabase(db: IName) {
    const st = new Date();
    const name: string = db.name;
    const res = deleteDatabase(name);
    return res
      ? composeSuccess('Deleted Database Successfully.', st)
      : composeError('Could not delete the database.', st);
  }
}
