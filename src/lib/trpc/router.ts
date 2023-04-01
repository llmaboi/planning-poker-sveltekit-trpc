import { displaysRouter } from './routes/displays';
import { roomsRouter } from './routes/rooms';
import { observable } from '@trpc/server/observable';
import { mergeRouters, publicProcedure, router } from './trpc';

const myRouter = router({
	displays: displaysRouter,
	rooms: roomsRouter
});

const existingRouter = router({
	allMessages: publicProcedure.subscription(({ ctx: { emitter } }) => {
		return observable<string>((emit) => {
			const onAdd = (message: string) => {
				emit.next(`${new Date().toLocaleTimeString()}: ${message}`);
			};

			emitter.on('add', onAdd);

			return () => {
				emitter.off('add', onAdd);
			};
		});
	}),
	addMessage: publicProcedure
		.input((input: unknown) => {
			if (typeof input === 'string') return input;

			throw new Error('Invalid input type');
		})
		.mutation(async ({ input: message, ctx: { emitter } }) => {
			emitter.emit('add', message);

			return { success: true };
		})
});

export const trpcMergedRouter = mergeRouters(existingRouter, myRouter);

export type Router = typeof trpcMergedRouter;
