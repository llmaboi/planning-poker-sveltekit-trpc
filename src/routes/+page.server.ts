import { createContext } from '$lib/trpc/context';
import { trpcMergedRouter } from '$lib/trpc/router';

export const load = async (event) => {
	return {
		rooms: trpcMergedRouter
			.createCaller(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				await createContext(event)
			)
			.rooms.list()
	};
};
