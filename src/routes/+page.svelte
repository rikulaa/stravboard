<script>
  import { signIn } from '@auth/sveltekit/client';

  export let isLoading = false

  export function handleSignIn() {
    isLoading = true;
    signIn('strava', { callbackUrl: '/dashboard' })
  }

</script>

<div class="content isolate">
  <section class="absolute inset-0 h-screen text-center flex justify-items-center items-center">
    <div class="flex-1">
      <h1 class="mb-16">Stravboard</h1>
      <button
        disabled={isLoading}
        style="background: #FC5200"
        class={`${isLoading ? 'animate-pulse' : ''} btn text-white w-64 border-none mx-auto`}
        on:click={handleSignIn}>{isLoading ? 'Fetching activities' : 'Sign In with Strava'}</button>
    </div>
  </section>
</div>
