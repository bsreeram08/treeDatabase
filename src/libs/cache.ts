import { ICaches, IQuery, IQueryMatch } from '../interfaces';
import { LRUCache } from './lru';
import { calculateTimeTaken } from './metrics';
import { Logger } from '@nestjs/common';
const logger = new Logger('Cache');

const caches: ICaches = {
  create: undefined,
  update: undefined,
  read: new LRUCache(100),
};

const TimeoutMap: { [key: string]: NodeJS.Timeout } = {};

export function putToLru(query: IQuery, response: string) {
  const queryType = query.operation;
  const st = new Date();
  const iqm: IQueryMatch = {
    database: query.database.name,
    query: JSON.stringify(query.query),
    table: query.table.name,
  };
  const hash = createHash(JSON.stringify(iqm));
  caches[queryType].set(hash, response);
  const t: NodeJS.Timeout = setTimeout(
    (hash, qt) => {
      caches[qt].remove(hash);
    },
    60000,
    hash,
    queryType,
  );
  TimeoutMap[hash] = t;
  calculateTimeTaken(st, logger, 'Put To LRU');
  return 0;
}

export function getFromLru(query: IQuery): string {
  const st = new Date();
  const qt = query.operation;
  const iqm: IQueryMatch = {
    database: query.database.name,
    query: JSON.stringify(query.query),
    table: query.table.name,
  };
  const hash = createHash(JSON.stringify(iqm));
  if (TimeoutMap[hash] != undefined) {
    TimeoutMap[hash].refresh;
  }
  calculateTimeTaken(st, logger, 'Get from LRU');
  return caches[qt].get(hash);
}

function createHash(data: string): number {
  let hash = 0;
  if (data.length === 0) return hash;
  for (let i = 0; i < data.length; i++) {
    const chr = data.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
