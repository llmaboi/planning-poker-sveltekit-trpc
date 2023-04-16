<script>
	import { page } from '$app/stores';

	let message = $page?.error?.message ?? 'Something went wrong';
</script>

<div>
	Something went wrong.

	<div class="error">{$page.error?.message} | {$page.status}: {message}</div>
</div>
