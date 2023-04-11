<script lang="ts">
	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc/client';
	import Card from '@components/Card.svelte';
	import VotingResults from '@components/VotingResults.svelte';
	import type { Display, Vote } from '@typings/common.types.js';
	import { onMount } from 'svelte';

	const client = trpc();

	export let data;

	const cards = [1, 2, 3, 5, 8, 13, 21, 34, 55];

	// TODO: Data for cardValue
	let selectedNumber: number | undefined;
	$: selectedNumber = data.currentDisplay?.cardValue ?? 0;
	let displays: Display[] = [];
	$: displays = displays;

	// TODO: I'm not sure how to do this yet...
	$: roomLabel = data.room.name ?? '';

	function handleLabelUpdate() {
		client.rooms.update.mutate({ ...data.room, label: roomLabel });
	}

	function handleCardReset() {
		client.rooms.reset.mutate({ id: data.room.id });
	}

	function handleLogout() {
		goto(`/`);
	}

	let roomVotes: Vote[] = [];

	function updateData(displays: Display[]) {
		displays = displays;
		roomVotes = displays.map((display) => ({
			name: display.name,
			value: display.cardValue
		}));

		const foundDisplay = displays.find((display) => display.name === data.currentDisplay.name);
		if (foundDisplay !== undefined) {
			selectedNumber = foundDisplay.cardValue;
		}
	}

	onMount(() => {
		client.rooms.socket.subscribe(
			{ roomId: data.room.id },
			{
				onData(data) {
					// eslint-disable-next-line
					// @ts-ignore
					typeof data?.displays !== 'undefined' && updateData(data.displays);
				}
			}
		);
	});

	function resetSelection() {
		client.displays.update.mutate({
			roomId: data.room.id,
			display: {
				...data.currentDisplay,
				isHost: data.currentDisplay.isHost ?? false,
				cardValue: 0
			}
		});
		selectedNumber = undefined;
	}

	function updateDisplayCard(number: number) {
		client.displays.update.mutate({
			roomId: data.room.id,
			display: {
				isHost: data.currentDisplay?.isHost ?? false,
				cardValue: number,
				name: data.currentDisplay.name
			}
		});
		selectedNumber = number;
	}
</script>

<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { trpc } from '$lib/trpc/client';

	const client = trpc();

	// onMount(() => {
	// 	// Load data and verify there is a room...
	// 	params.roomId;
	// 	params.displayId;

	// 	if (
	// 		typeof params.displayId === 'string' &&
	// 		params.displayId.length > 0 &&
	// 		typeof params.roomId === 'string' &&
	// 		params.roomId.length > 0
	// 	) {
	// 		// TODO: Add display data...

	// 		return client.rooms.getById.query({ roomId: params.roomId }).then((data) => {
	// 			const currentDisplay = data.displays.find((display) => display.id === params.displayId);
	// 			return {
	// 				room: data,
	// 				currentDisplay: {
	// 					...currentDisplay,
	// 					name: params.displayId
	// 				}
	// 			};
	// 		});
	// 	}

	// 	throw new Error(`Room # ${params.roomId} not found`);
	// });

</script> -->

<!-- TODO: If is not host don't allow label editing.  -->

<section class="DisplayHeading">
	<label id="room-label">
		Room Label:
		<!-- disabled={updateRoom.isLoading} -->
		<input type="text" bind:value={roomLabel} />
	</label>

	<!-- disabled={updateRoom.isLoading || label.length <= 0}  -->
	<button on:click={handleLabelUpdate}>Update label</button>

	<!-- disabled={resetCardValuesMutation.isLoading}  -->
	<button on:click={handleCardReset}>Reset cards</button>

	<!-- {roomDetails.showVotes ? (
    <button disabled={updateRoom.isLoading} onClick={handleShowVotes}>
      Hide Votes
    </button>
  ) : (
    <button disabled={updateRoom.isLoading} onClick={handleShowVotes}>
      Show Votes
    </button>
  )} -->

	<button on:click={handleLogout}>Change Room</button>
</section>

<section class="Room">
	<h1>{data.room.name}</h1>
	<div class="ResetSelection">
		<button
			disabled={selectedNumber === undefined || selectedNumber === 0}
			on:click={resetSelection}>Reset Selection</button
		>
	</div>

	<section class="RoomCards">
		{#key selectedNumber}
			{#each cards as card}
				<Card
					buttonDisabled={typeof selectedNumber === 'number' && selectedNumber > 0}
					number={card}
					onClick={updateDisplayCard}
					{selectedNumber}
				/>
			{/each}
		{/key}
	</section>

	{#if data.room.showVotes}
		<VotingResults votes={roomVotes} />
	{/if}

	<section class="PieChart">
		<!-- TODO: -->
	</section>
</section>

<style>
	.RoomCards {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	.ResetSelection {
		text-align: center;
		margin: 1rem auto;
	}
</style>
