<script lang="ts">
	import { goto } from '$app/navigation';

	export let rooms: { name: string }[];

	function goToRoom(room: string) {
		goto(`room/${room}`);
	}
</script>

<section class="RoomList">
	{#if rooms.length > 0}
		<h3>Available rooms:</h3>
	{/if}

	<section class="Rooms">
		{#each rooms as room}
			<button on:click={() => goToRoom(room.name)}>{room.name}</button>
		{/each}
	</section>
</section>

<style>
	h3 {
		text-align: center;
		margin: 1rem auto;
	}
	.RoomList {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
	}

	.Rooms {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		width: 50%;
	}
	button {
		margin: 0.25rem 0.5rem;
	}
</style>
