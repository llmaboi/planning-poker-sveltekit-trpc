<script lang="ts">
	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc/client';

	const client = trpc();

	export let data;

	$: displayName = '';
	$: isHost = false;

	function handleSubmit() {
		client.displays.create
			.mutate({
				display: {
					cardValue: 0,
					isHost,
					name: displayName
				},
				roomId: data.id
			})
			.then((data) => {
				goto(`/room/${data.id}/${displayName}`);
			});
	}
</script>

<section class="DisplayLogin">
	<form on:submit|preventDefault={handleSubmit}>
		<label>
			Display Name:
			<input required type="text" bind:value={displayName} />
		</label>
		<label class="Checkbox">
			<input type="checkbox" bind:checked={isHost} />
			Room Host
		</label>

		<button disabled={!displayName.length} type="submit">Join room</button>
	</form>
</section>

<!-- TODO: Move to component -->
<section class="DisplaysInRoom">
	{#if data.displays.length > 0}
		<h4>Current displays in {data.name}</h4>
		<ul>
			{#each data.displays as display}
				<li>{display.name}</li>
			{/each}
		</ul>
	{:else}
		<h4>There are no displays currently in {data.name}</h4>
	{/if}
</section>
