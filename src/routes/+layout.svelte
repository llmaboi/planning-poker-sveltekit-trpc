<script lang="ts">
	import './main.css';
</script>

<main class="container">
	<slot />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
	}
</style>
