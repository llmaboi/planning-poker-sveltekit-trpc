<script lang="ts">
	export let rooms: { name: string }[];
</script>

<ul>
	{#each rooms as room}
		<li>{room.name}</li>
	{/each}
</ul>
