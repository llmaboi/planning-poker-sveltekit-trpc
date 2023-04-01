<script>
	import { page } from '$app/stores';

	let message = $page?.error?.message ?? 'Something went wrong';
</script>

<h3>{$page.status}: {message}</h3>
