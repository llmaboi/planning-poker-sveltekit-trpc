<script lang="ts">
	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc/client';
	import type { Display } from '@typings/common.types.js';
	import { onMount } from 'svelte';

	const client = trpc();

	export let data;

	let roomName = '';
	let displays: Display[] = [];

	$: displays = [];
	$: displayName = '';
	$: isHost = false;

	onMount(() => {
		displays = data.room.displays;
		roomName = data.room.name;
	});

	function handleSubmit() {
		client.displays.createOrUpdate
			.mutate({
				display: {
					cardValue: 0,
					isHost,
					name: displayName
				},
				roomId: data.room.id
			})
			.then((data) => {
				goto(`/room/${data.id}/${displayName}`);
			});
	}
</script>

<section class="DisplayLogin">
	<form on:submit|preventDefault={handleSubmit}>
		<label>
			Your Display Name:
			<input class="DisplayInput" required type="text" bind:value={displayName} />
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
	{#if displays.length > 0}
		<h3>Current displays in {roomName}</h3>
		<ul>
			{#each displays as display}
				<li>{display.name}</li>
			{/each}
		</ul>
	{:else}
		<h3>There are no displays currently in {roomName}</h3>
	{/if}
</section>

<style>
	.DisplaysInRoom {
		background-color: #34495e;
		padding: 4rem;
	}

	form {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	form label {
		margin: 0.25rem auto;
	}

	.DisplayInput {
		display: flex;
	}

	.Checkbox {
		cursor: pointer;
	}

	h3 {
		text-align: center;
		margin: 1rem auto;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	li {
		margin: 0.5rem;
		display: inline-flex;
	}
</style>
