import { SvelteKitAuth } from "@auth/sveltekit"
import Strava from "@auth/core/providers/strava"
import type { Handle } from "@sveltejs/kit";
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, AUTH_SECRET } from "$env/static/private"
import { clearCache } from "$lib/server/db";

export const handle = SvelteKitAuth({
  providers: [Strava<any>({
    clientId: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    authorization: {
      params: {
        scope: 'read,activity:read',
        approval_prompt: "auto",
        response_type: "code",
      }
    },
  })],
  secret: AUTH_SECRET,
  trustHost: true,
  events: {
    signOut: ({ token }) => {
      clearCache(token.athleteId);
    }
  },
  callbacks: {
    session: ({ session, token }) => {
      session.accessToken = token.accessToken;
      session.athleteId = token.athleteId;
      return session;
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.athleteId = account.athlete.id;
      }
      return token
    },
  }

}) satisfies Handle;
