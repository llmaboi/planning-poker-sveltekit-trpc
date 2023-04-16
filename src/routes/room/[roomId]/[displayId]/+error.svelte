<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>Something went wrong finding this room or your display.</div>
<div>{$page.error?.message}</div>
<a href="/">Go Home</a>
