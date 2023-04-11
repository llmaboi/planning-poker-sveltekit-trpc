import { createContext } from '$lib/trpc/context';
import { trpcMergedRouter } from '$lib/trpc/router';

export const load = async (event) => {
	return {
		room: trpcMergedRouter
			.createCaller(await createContext(event))
			.rooms.getById({ roomId: event.params.roomId })
	};
};
