import { getTime, parseISO } from 'date-fns';
import polyline from '@mapbox/polyline';
import strava from 'strava-v3';

export type Athlete = {
  id: number;
  resource_state: number;
};

export type Map = {
  id: string;
  summary_polyline: string | null;
  resource_state: number;
  // enriched
  polyline_coordinates: [number, number][];
};

export type Activity = {
  url: string; // enriched
  resource_state: number;
  athlete: Athlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type: null | string;
  id: number;
  external_id: string;
  upload_id: number;
  start_date: string;
  start_date_timestamp: number;
  start_date_local: string;
  start_date_local_timestamp: number;
  timezone: string;
  utc_offset: number;
  start_latlng: null | [number, number];
  end_latlng: null | [number, number];
  location_city: null | string;
  location_state: null | string;
  location_country: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: Map;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  gear_id: null | string;
  from_accepted_tag: boolean;
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  average_watts: number;
  weighted_average_watts: number;
  kilojoules: number;
  device_watts: boolean;
  has_heartrate: boolean;
  average_heartrate: number;
  max_heartrate: number;
  max_watts: number;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  suffer_score: number;
};

export function transform(a: Activity) {
  return {
    ...a,
    start_date_timestamp: getTime(parseISO(a.start_date)),
    start_date_local_timestamp: getTime(parseISO(a.start_date_local)),
    map: {
      ...a.map,
      polyline_coordinates: polyline.decode(a.map.summary_polyline)
    },
    url: `https://strava.com/activities/${a.id}`,
  }
}

async function fetchActivities(accessToken: string, page: number): Promise<Activity[]> {
  return strava.athlete.listActivities({ access_token: accessToken, per_page: 100, page });
}

export async function getActivities(accessToken: string): Promise<Activity[]> {
  let page = 1;
  let activities: Activity[] = [];
  let current = [];
  do {
    current = await fetchActivities(accessToken, page);
    console.log('len', current.length);
    activities = [
      ...activities,
      ...current
    ];
    page = page + 1;
  } while (current.length > 0)

  return activities.map(transform);
}

