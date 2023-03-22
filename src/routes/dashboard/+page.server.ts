import { cache, getTable, query } from '$lib/server/db';
import type { PageServerLoad } from '../sverdle/$types';
import { getActivities } from '$lib/server/strava';
import { redirect } from '@sveltejs/kit';
import { endOfYear, getTime, getYear, parseISO, startOfYear } from 'date-fns';

export const load: PageServerLoad = async (event) => {
  const searchParams = event.url.searchParams;

  const session = await event.locals.getSession();
  if (!session) {
    throw redirect(302, '/');
  }
  
  const { athleteId, accessToken } = session;

  let table = getTable(athleteId);
  if (!table) {
    try {
      const stravaActivitites = await getActivities(accessToken);
      table = await cache(athleteId, stravaActivitites);
    } catch (e) {
      console.error(e);
      throw redirect(302, '/');
    }
  }


  const q: Record<string, any> = {};
  for (const [key] of searchParams.entries()) {
    if (key === 'year') {
      const value = searchParams.get(key);
      if (value) {
        const [start, end] = value.split(',').map(v => parseInt(v));
        q.start_date_timestamp = {
          between: [start, end]
        };
      }
    } else {
      const v = searchParams.get(key);
      if (v) {
        q[key] = v;
      }

    }

  }
  const activities = await query(table, {});
  const filteredActivities = await query(table, q);

  const { totalDistanceInMeters, totalMovingTimeInSeconds, totalElapsedTimeInSeconds, totalElevationGainInMeters, averageSpeed } = filteredActivities.reduce((acc, cur) => {
    return {
      totalDistanceInMeters: acc.totalDistanceInMeters + cur.distance,
      totalMovingTimeInSeconds: acc.totalMovingTimeInSeconds + cur.moving_time,
      totalElapsedTimeInSeconds: acc.totalElapsedTimeInSeconds + cur.elapsed_time,
      totalElevationGainInMeters: acc.totalElevationGainInMeters + cur.total_elevation_gain,
      averageSpeed: {
        count: acc.averageSpeed.count + 1,
        sum: acc.averageSpeed.sum + cur.average_speed,
      }
    }
  }, {
    totalDistanceInMeters: 0,
    totalMovingTimeInSeconds: 0,
    totalElapsedTimeInSeconds: 0,
    totalElevationGainInMeters: 0,
    averageSpeed: {
      count: 0,
      sum: 0
    }
  });

  // set query parameters to response
  // event.setContext('query', { type: 'Ride'});
  event.url.searchParams.set('type', 'Ride');

  return {
    activities: filteredActivities,
    stats: {
      totalCount: filteredActivities.length,
      totalDistanceInMeters,
      totalMovingTimeInSeconds,
      totalElapsedTimeInSeconds,
      totalElevationGainInMeters,
      averageSpeed: (averageSpeed.sum > 0 ? (averageSpeed.sum / averageSpeed.count) * 3.6 : 0) // to  km/h,
    },
    filters: {
      type: Object.keys(activities.reduce((acc, cur) => {
        acc[cur.type] = 1;
        return acc;
      }, {} as Record<string, any>)),
      year: activities.reduce((acc, cur) => {
        const d = parseISO(cur.start_date);
        const year = getYear(d);
        if (acc[year]) return acc;
        const yearStart = getTime(startOfYear(d));
        const yearEnd = getTime(endOfYear(d));
        acc[year] = [yearStart, yearEnd];
        return acc;
      }, {} as Record<string, any>)
    },
    session
  }
}
