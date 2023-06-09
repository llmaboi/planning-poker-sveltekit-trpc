import { trpcMergedRouter } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';

export const load = async (event) => {
	const room = await trpcMergedRouter
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		.createCaller(await createContext(event))
		.rooms.getById({ roomId: event.params.roomId });

	const currentDisplay = room.displays.find((display) => display.name === event.params.displayId);

	return {
		room,
		currentDisplay: {
			...currentDisplay,
			name: event.params.displayId
		}
	};
};
