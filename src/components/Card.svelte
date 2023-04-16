<script lang="ts">
	export let number: number;
	export let selectedNumber: number | undefined;
	export let buttonDisabled: boolean;
	export let onClick: (number: number) => void;

	function handleCardClick() {
		onClick(number);
	}

	let className = 'Card';
	if (buttonDisabled) {
		className += ' disabled';
	}

	if (typeof selectedNumber === 'number' && selectedNumber === number) {
		className = 'Card selected';
	}
</script>

<button class={className} on:click={handleCardClick} disabled={buttonDisabled}>
	{number}
</button>

<style>
	.Card {
		align-items: center;
		border: 0.2rem solid;
		font-size: 2.5rem;
		font-weight: bold;
		height: 15rem;
		margin: 0.5rem;
		width: 10rem;
	}

	.disabled {
		color: #c8374f;
		cursor: not-allowed;
	}

	.selected {
		color: #2ac348;
	}
</style>
