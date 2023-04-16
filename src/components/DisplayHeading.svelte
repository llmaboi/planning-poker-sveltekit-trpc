<script lang="ts">
	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc/client';
	import type { Room } from '@typings/common.types';
	import { onMount } from 'svelte';

	const client = trpc();

	export let data: { room: Room; isHost: boolean };

	// TODO: I'm not sure how to do this yet...
	// TODO: Fix bug with updating label...
	$: roomLabel = '';

	$: isLoading = false;

	onMount(() => {
		roomLabel = data.room.label ?? '';
	});

	function handleLabelUpdate() {
		isLoading = true;
		client.rooms.update
			.mutate({ ...data.room, label: roomLabel })
			.then((data) => {
				roomLabel = data.label;
			})
			.finally(() => (isLoading = false));
	}

	function handleCardReset() {
		isLoading = true;
		client.rooms.reset.mutate({ id: data.room.id }).finally(() => (isLoading = false));
	}

	function handleLogout() {
		goto(`/`);
	}

	function handleShowVotes() {
		isLoading = true;
		client.rooms.update
			.mutate({ ...data.room, showVotes: !data.room.showVotes })
			.finally(() => (isLoading = false));
	}
</script>

<section class="DisplayHeading">
	<div class="firstRow">
		{#if data.isHost}
			<label id="room-label">
				<input type="text" disabled={isLoading} bind:value={roomLabel} />
			</label>

			<button disabled={isLoading} on:click={handleLabelUpdate}> Update label </button>
		{:else}
			<p>Room Label: {roomLabel.length > 0 ? roomLabel : 'No Room Label'}</p>
		{/if}
	</div>

	{#if data.isHost}
		<div class="secondRow">
			<button disabled={isLoading} on:click={handleCardReset}>Reset cards</button>

			{#if data.room.showVotes}
				<button disabled={isLoading} on:click={handleShowVotes}>Hide Votes</button>
			{:else}
				<button disabled={isLoading} on:click={handleShowVotes}>Show Votes</button>
			{/if}

			<button on:click={handleLogout}>Change Room</button>
		</div>
	{:else}
		<div class="secondRow">
			<button on:click={handleLogout}>Change Room</button>
		</div>
	{/if}
</section>

<style>
	.DisplayHeading {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		margin-bottom: 1rem;
	}

	.firstRow,
	.secondRow {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		width: 50%;
	}

	.firstRow {
		margin: 1rem auto;
	}

	button {
		width: auto;
	}
</style>
