<script lang="ts">
	import { trpc } from '$lib/trpc/client';
	import Card from '@components/Card.svelte';
	import DisplayHeading from '@components/DisplayHeading.svelte';
	import VotingResults from '@components/VotingResults.svelte';
	import type { Display, Room, Vote } from '@typings/common.types.js';
	import { onMount } from 'svelte';

	const client = trpc();

	export let data;

	const cards = [1, 2, 3, 5, 8, 13, 21, 34, 55];

	// TODO: Data for cardValue
	let currentDisplay: Display;
	// $: currentDisplay;
	let displays: Display[] = [];
	$: displays = displays;
	let room: Room;
	$: room;

	let roomVotes: Vote[] = [];

	function updateData(displays: Display[]) {
		displays = displays;
		roomVotes = displays.map((display) => ({
			name: display.name,
			value: display.cardValue
		}));

		const foundDisplay = displays.find((display) => display.name === data.currentDisplay.name);
		if (foundDisplay !== undefined) {
			currentDisplay = foundDisplay;
		}
	}

	onMount(() => {
		room = data.room;
		currentDisplay = {
			cardValue: data.currentDisplay.cardValue ?? 0,
			isHost: data.currentDisplay.isHost ?? false,
			name: data.currentDisplay.name
		};

		client.rooms.socket.subscribe(
			{ roomId: data.room.id },
			{
				onData(data) {
					const newroom = {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						id: data.id,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						name: data.name,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						label: data.label,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						showVotes: data.showVotes
					};
					room = newroom;
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
		currentDisplay.cardValue = 0;
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
		currentDisplay.cardValue = number;
	}
</script>

<section class="Room">
	<h1>{data.room.name}</h1>

	{#if typeof room === 'object'}
		<DisplayHeading data={{ room: room, isHost: currentDisplay.isHost }} />
	{/if}

	<div class="ResetSelection">
		<button disabled={currentDisplay?.cardValue === 0} on:click={resetSelection}>
			Reset Selection
		</button>
	</div>

	<section class="RoomCards">
		{#key currentDisplay?.cardValue}
			{#each cards as card}
				<Card
					buttonDisabled={currentDisplay?.cardValue > 0}
					number={card}
					onClick={updateDisplayCard}
					selectedNumber={currentDisplay?.cardValue ?? 0}
				/>
			{/each}
		{/key}
	</section>

	{#if room?.showVotes}
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
