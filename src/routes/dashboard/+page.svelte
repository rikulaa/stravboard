<script lang="ts">
    import { goto } from '$app/navigation';
    import { page, navigating } from '$app/stores';
    import { format, formatDuration, parseISO } from 'date-fns';
    import { timeToDuration } from '$lib/date';

    export let transitionClasses = 'transition-all duration-300';
    export let loadingClasses = 'opacity-100';
    navigating.subscribe(v => {
            loadingClasses = v ? 'opacity-50' : 'opacity-100';
    })

    export let data;

    export const headers = ['Date', 'Name', 'Type', 'Distance', 'Moving time', ''];

    export function navigate(params: Record<string, any>) {
        const url = new URL($page.url);
        for (const key of Object.keys(params)) {
            url.searchParams.set(key, params[key]);
        }
        goto(url, { noScroll: true });
    }
</script>

<main>
    <h2 class="mb-16">Hello {$page.data.session?.user?.name} 👋</h2>

    <div class={`${transitionClasses} ${loadingClasses}`}>
        <div class="text-center flex flex-col max-w-5xl">
            <div class={`flex flex-col justify-center md:flex-row `}>
                <div class="flex-1 pb-16">
                    <div class="stat-title">Count of activities</div>
                    <div class="stat-value">{data.stats.totalCount}</div>
                </div>

                <div class="flex-1 pb-16">
                    <div class="stat-title">Average speed</div>
                    <div class="stat-value">
                        {data.stats.averageSpeed.toFixed(2)}km/h
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center flex flex-col max-w-5xl">
            <div class="flex flex-col md:flex-row ">
                <div class="flex-1 pb-16">
                    <div class="stat-title">Total distance</div>
                    <div class="stat-value">{(data.stats.totalDistanceInMeters / 1000).toFixed(2)}km</div>
                </div>

                <div class="flex-1 pb-16">
                    <div class="stat-title">Total elevation gain</div>
                    <div class="tooltip" data-tip={`You have climbed Mount Everest ${ Math.floor(data.stats.totalElevationGainInMeters / 8848.86)} times!`}>
                        <div class="stat-value">
                            {data.stats.totalElevationGainInMeters.toFixed(2)}m
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center flex flex-col max-w-5xl mb-16">
            <div class="flex flex-col md:flex-row">
                <div class="flex-1">
                    <div class="stat-title">Total moving time</div>
                    <div class="stat-value">
                        {(timeToDuration(data.stats.totalMovingTimeInSeconds)).hours}h
                    </div>
                </div>

                <div class="flex-1">
                    <div class="stat-title">Total elapsed time</div>
                    <div class="stat-value">
                        {timeToDuration(data.stats.totalElapsedTimeInSeconds).hours}h
                    </div>
                </div>
            </div>
        </div>
    </div>

        <div class="flex space-x-8 mb-16">
            <div class="flex-1">
                <label class="label">
                    <span class="label-text">Type</span>
                </label>
                <select
                    disabled={!!$navigating}
                    class={`${transitionClasses} select select-bordered w-full`}
                    on:change={(evt) => navigate({ type: evt.target.value })}
                >
                    <option value="">All</option>
                    {#each data.filters.type as type}
                        <option selected={$page.url.searchParams.get('type') === type}>{type}</option>
                    {/each}
                </select>
            </div>
            <div class="flex-1">
                <label class="label">
                    <span class="label-text">Year</span>
                </label>
                <select
                    disabled={!!$navigating}
                    class={`${transitionClasses} select select-bordered w-full`}
                    on:change={(e) => navigate({ year: e.target.value })}
                >
                    <option value="">All</option>
                    {#each Object.keys(data.filters.year).sort().reverse() as y}
                        <option selected={$page.url.searchParams.get('year') === data.filters.year[y].join(',')} value={data.filters.year[y]}>{y}</option>
                    {/each}
                </select>
            </div>
        </div>

    <div class={`overflow-x-auto ${loadingClasses}`}>
        <table class={`table table-compact w-full`}>
            <thead>
                <tr>
                    {#each headers as h}
                        <th>{h}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each data.activities as a}
                    <tr>
                        <td>
                            {format(parseISO(a.start_date), 'yyyy-MM-dd')}
                        </td>
                        <td>
                            {a.name}
                        </td>
                        <td>
                            {a.type}
                        </td>
                        <td>
                            {(a.distance / 1000).toFixed(2)} km
                        </td>
                        <td>
                            {formatDuration(timeToDuration(a.moving_time), { format: ['hours', 'minutes']})}
                        </td>
                        <td>
                            <a target="_blank" rel="noreferer nofollow" href={a.url} class="btn btn-ghost btn-xs"
                            >Open in Strava</a
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</main>
