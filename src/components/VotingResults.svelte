<script lang="ts">
	import type { Vote } from '../types/common.types';
	import VoteItem from './VoteItem.svelte';

	export let votes: Vote[];

	$: votedItems = votes.filter((vote) => vote.value > 0);
	$: notVotedItems = votes.filter((vote) => vote.value <= 0);
</script>

<section class="VotingResults">
	<h3>Room voting results:</h3>
	<span>
		{votedItems.length} of {votes.length} voted
	</span>

	<div class="VotedWrapper">
		<section class="Voted">
			<span class="VotedLabel">Voted</span>
			<div class="Votes">
				{#each votedItems as vote}
					<VoteItem {vote} />
				{/each}
			</div>
		</section>

		<section class="NotVoted">
			<span class="NotVotedLabel">Not Voted</span>
			<div class="Votes">
				{#each notVotedItems as notVoted}
					<VoteItem vote={notVoted} />
				{/each}
			</div>
		</section>
	</div>
</section>

<style>
	.VotingResults {
		text-align: center;
	}

	.VotingResults h3 {
		margin-bottom: 0;
	}

	.VotedWrapper {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
	}

	.Votes {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	.Voted,
	.NotVoted {
		border-radius: 1rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 0 0.5rem;
	}

	.Voted {
		border: 0.2rem solid #2ac348;
	}

	.NotVoted {
		border: 0.2rem solid #c8374f;
	}

	.VotedLabel,
	.NotVotedLabel {
		margin: 0.2rem 0;
		font-size: 2rem;
		font-weight: bold;
	}
</style>
