import { error } from '@sveltejs/kit';
import { trpc } from '$lib/trpc/client';

const client = trpc();

export const load = ({ params }) => {
	// Load data and verify there is a room...

	if (typeof params.roomId === 'string' && params.roomId.length >= 1) {
		return client.displays.listByRoom.query({ roomId: params.roomId }).then((displays) => {
			// TODO: get room name?
			return {
				id: params.roomId,
				name: 'Test',
				displays
			};
		});
	}

	throw error(404, `Room # ${params.roomId} not found`);
};
