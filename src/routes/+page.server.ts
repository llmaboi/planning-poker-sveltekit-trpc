import { createContext } from '$lib/trpc/context';
import { trpcMergedRouter } from '$lib/trpc/router';

export const load = async (event) => {
	return {
		rooms: trpcMergedRouter
			.createCaller(
				//
				await createContext(event)
			)
			.rooms.list()
	};
};
