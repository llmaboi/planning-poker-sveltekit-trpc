<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc/client';
	import type { RoomMapItem } from '$lib/trpc/sessions';
	import { onMount } from 'svelte';
	import RoomList from '../components/RoomList.svelte';

	const client = trpc();

	let data: RoomMapItem[] = [];

	// TODO: Move this to a server file?
	onMount(() => {
		client.rooms.list.query().then((roomsMap) => {
			data = roomsMap;
		});
		// client.rooms.socket.subscribe((data) => {
		// 	console.log('subscribed to data: ', data);
		// });
	});

	$: roomName = '';

	function handleCreateRoom() {
		client.rooms.create
			.mutate({
				label: '',
				name: roomName,
				showVotes: false
			})
			.then((data) => {
				goto(`/room/${data.id}`);
			});
	}

	$: filteredRooms = data.filter((room) =>
		room.name.toLowerCase().includes(roomName.toLowerCase())
	);
</script>

<h1>WebSocket example</h1>
<p>
	Open <a href={`${$page.url}messages`} target="_blank">{$page.url}messages</a> in a new window/tab.
</p>

<section class="RoomLogin">
	<h1 class="Heading">Search for or select your room</h1>
	<form on:submit|preventDefault={handleCreateRoom}>
		<label class="RoomInput">
			Create New Room:
			<input required type="text" bind:value={roomName} />
		</label>
		<button class="RoomCreate" disabled={!roomName.length} type="submit">Create room</button>
	</form>

	<!-- onSelectRoom={handleRoomSelection} -->
	<RoomList rooms={filteredRooms} />
</section>

<style>
	form {
		display: 'flex';
		flex-direction: 'column';
	}
</style>
