<script lang="ts">
	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc/client';
	import RoomList from '../components/RoomList.svelte';

	export let data;

	const client = trpc();

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

	$: filteredRooms = data.rooms.filter((room) =>
		room.name.toLowerCase().includes(roomName.toLowerCase())
	);
</script>

<section class="RoomLogin">
	<h1 class="Heading">Search for or select your room</h1>
	<form on:submit|preventDefault={handleCreateRoom}>
		<label class="RoomInput">
			Create or filter rooms:
			<input required type="text" bind:value={roomName} />
		</label>

		<button class="RoomCreate" disabled={!roomName.length} type="submit">
			Create or Join Room
		</button>
	</form>
</section>

<RoomList rooms={filteredRooms} />

<style>
	.RoomLogin {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.RoomCreate {
		margin-top: 1rem;
	}

	form,
	.RoomInput {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.RoomInput {
		font-size: 2rem;
	}
</style>
