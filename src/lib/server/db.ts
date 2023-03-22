import { NODE_ENV } from "$env/static/private";
import type { Activity } from "./strava";

const isDev = NODE_ENV === 'development';
global.TABLES_BY_ACCESS_TOKEN = isDev ? (global.TABLES_BY_ACCESS_TOKEN || {}) : {};

export async function cache(athleteId: number, items: Activity[]): Promise<Activity[]> {
  global.TABLES_BY_ACCESS_TOKEN[athleteId] = items;
  return items;
}

export function getTable(athleteId: number): Activity[] {
  return global.TABLES_BY_ACCESS_TOKEN[athleteId];
}

export async function query(items: Activity[], q: Record<string, any>): Promise<Activity[]> {
  if (Object.keys(q).length > 0) {
    return items
      .filter((item: Activity) => {
        for (const [key, value] of Object.entries(q)) {
          if (key === 'start_date_timestamp') {
            const [start, end] = value.between;
            return item.start_date_timestamp > start && item.start_date_timestamp < end;
          }
          return item[key] === value;
        }
      })
      .sort((a, b) => {
        // sort by descending order
        return b.start_date_timestamp - a.start_date_timestamp;
      });
  }

  return items;
}

export function clearCache(athleteId: number) {
  global.DB_BY_ACCESS_TOKEN[athleteId] = null;
  global.TABLES_BY_ACCESS_TOKEN[athleteId] = null;
}


