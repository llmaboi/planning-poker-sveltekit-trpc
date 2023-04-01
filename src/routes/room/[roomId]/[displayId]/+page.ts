import { error } from '@sveltejs/kit';
import { trpc } from '$lib/trpc/client';

const client = trpc();

export const load = ({ params }) => {
	// Load data and verify there is a room...
	params.roomId;
	params.displayId;

	if (
		typeof params.displayId === 'string' &&
		params.displayId.length > 0 &&
		typeof params.roomId === 'string' &&
		params.roomId.length > 0
	) {
		// TODO: Add display data...

		return client.rooms.getById.query({ roomId: params.roomId }).then((data) => {
			const currentDisplay = data.displays.find((display) => display.name === params.displayId);

			if (typeof currentDisplay === 'undefined') throw new Error('Display not found');

			return {
				room: data,
				currentDisplay: {
					...currentDisplay,
					name: params.displayId
				}
			};
		});
	}

	throw error(404, `Room # ${params.roomId} not found`);
};
