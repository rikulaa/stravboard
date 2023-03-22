import { NODE_ENV } from "$env/static/private";
import { type Table, createDB, createTable, insertMany, many } from "blinkdb";
import type { Activity } from "./strava";

const isDev = NODE_ENV === 'development';
global.DB_BY_ACCESS_TOKEN = isDev ? (global.DB_BY_ACCESS_TOKEN || {}) : {};
global.TABLES_BY_ACCESS_TOKEN = isDev ? (global.TABLES_BY_ACCESS_TOKEN || {}) : {};

export async function cache(athleteId: number, items: Activity[]): Promise<Table<Activity, "id">> {
  const db = global.DB_BY_ACCESS_TOKEN[athleteId] || createDB();
  global.DB_BY_ACCESS_TOKEN[athleteId] = db;

  const table = global.TABLES_BY_ACCESS_TOKEN[athleteId] || createTable<Activity>(db, `${athleteId}_activities`)();
  await insertMany(table, items);
  global.TABLES_BY_ACCESS_TOKEN[athleteId] = table;
  return table;
}

export function getTable(athleteId: number): Table<Activity, "id"> {
  return global.TABLES_BY_ACCESS_TOKEN[athleteId];
}

export async function query(table: Table<Activity, "id">, q: any): Promise<Activity[]> {
  const sort = {
    key: 'start_date',
    order: 'desc'
  };

  return many(table, Object.keys(q).length > 0 ? {
    where: q,
    sort,
  } : { sort });
}

export function clearCache(athleteId: number) {
  global.DB_BY_ACCESS_TOKEN[athleteId] = null;
  global.TABLES_BY_ACCESS_TOKEN[athleteId] = null;
}


