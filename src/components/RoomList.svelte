<script lang="ts">
	import { goto } from '$app/navigation';

	export let rooms: { name: string }[];

	function goToRoom(room: string) {
		goto(`room/${room}`);
	}
</script>

{#if rooms.length > 0}
	<h3>Available rooms:</h3>
{/if}
<section class="RoomList">
	{#each rooms as room}
		<button on:click={() => goToRoom(room.name)}>{room.name}</button>
	{/each}
</section>

<style>
	h3 {
		text-align: center;
		margin: 1rem auto;
	}
	.RoomList {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		width: 50%;
	}
	button {
		margin: auto 0.5rem;
	}
</style>
