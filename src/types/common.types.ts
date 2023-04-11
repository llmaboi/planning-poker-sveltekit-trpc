export type Vote = {
	name: string;
	value: number;
};

export type Room = {
	id: string;
	label: string;
	name: string;
	showVotes: boolean;
};

export type Display = {
	name: string;
	cardValue: number;
	isHost: boolean;
};
