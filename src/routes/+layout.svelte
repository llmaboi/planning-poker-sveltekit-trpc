<script lang="ts">
	import './reset.css';
	import './main.css';
</script>

<main class="container">
	<slot />
</main>

<style>
	main {
		background-color: #34495e;
		border-radius: 1rem;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		min-height: 40rem;
		padding: 4rem;
		margin: 2rem;
	}
</style>
