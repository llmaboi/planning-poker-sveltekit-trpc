import { createContext } from '$lib/trpc/context';
import { trpcMergedRouter } from '$lib/trpc/router';

export const load = async (event) => {
	return {
		room: trpcMergedRouter
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			.createCaller(await createContext(event))
			.rooms.getById({ roomId: event.params.roomId })
	};
};
