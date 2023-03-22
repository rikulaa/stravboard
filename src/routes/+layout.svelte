<script lang="ts">
  import '../app.postcss';
  import { signOut } from '@auth/sveltekit/client';
  import './styles.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  let value: string | null = null;
  let theme: Writable<string | null>;
  onMount(async () => {
    var { theme: t } = await import('../stores/theme');

  t.subscribe((v) => {
      value = v;
    });
    theme = t;
  });

  export function toggleTheme() {
    theme.set(value === 'dark' ? 'light' : 'dark');
  }
</script>

<svelte:head>
  <title>Stravboard</title>
  <meta name="description" content="Simple dashboard app from your Strava-activities" />
</svelte:head>

<div class="app">
  <header class="z-10 relative p-4 flex flex-row justify-between">
    <div class="flex flex-row">
      {#if $page.route.id !== '/'}
        <svg
          class="w-6 h-6 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
        <input type="checkbox" class="toggle" checked={value === 'light'} on:change={toggleTheme} />
      {:else}
        <div />
      {/if}
    </div>
    {#if $page.data?.session}
      <button class="btn btn-ghost" on:click={() => signOut()}>Sign out</button>
    {/if}
  </header>

  <main class="content">
    <slot />
  </main>
</div>
