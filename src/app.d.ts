// See https://kit.svelte.dev/docs/types#app

import type { Database } from "blinkdb";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
    var DB: Database,
    var TABLES_BY_ACCESS_TOKEN: any,
    var DB_BY_ACCESS_TOKEN: any,
}

export {};
