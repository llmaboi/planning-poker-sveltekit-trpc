<script lang="ts">
	import './reset.css';
	import './main.css';
</script>

<main class="container">
	<slot />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		align-items: center;
	}
</style>
