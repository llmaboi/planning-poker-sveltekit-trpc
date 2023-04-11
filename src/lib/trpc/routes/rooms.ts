import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import type { Display } from '@typings/common.types';
import { z } from 'zod';
import { kebabStyle } from '../kebabStyle';
import type { RoomMapItem } from '../socketActions';
import { publicProcedure, router } from '../trpc';

const ZodRoom = z.object({
	id: z.string().min(1),
	label: z.string().nullable(),
	name: z.string().min(1),
	showVotes: z.boolean()
});

export const roomsRouter = router({
	socket: publicProcedure.input(z.object({ roomId: z.string() })).subscription(({ ctx, input }) => {
		return observable((emit) => {
			function onDisplayUpdate(data: RoomMapItem & { displays: Display[] }) {
				emit.next(data);
			}

			ctx.emitter.on(input.roomId, onDisplayUpdate);

			return () => {
				ctx.emitter.off(input.roomId, onDisplayUpdate);
			};
		});
	}),
	getById: publicProcedure
		.input(z.object({ roomId: z.string() }))
		.query(({ input, ctx: { getRoomById } }) => {
			const maybeRoom = getRoomById(input.roomId);
			if (maybeRoom === undefined)
				throw new TRPCError({ code: 'NOT_FOUND', message: 'room not found' });

			const displays = Array.from(maybeRoom.displays.values());
			return {
				...maybeRoom,
				displays
			};
		}),
	create: publicProcedure
		.input(ZodRoom.omit({ id: true }))
		.mutation(function ({ input, ctx: { cleanupRoomMap, registerRoom } }) {
			const id = kebabStyle(input.name);
			const newDisplayMapItem: RoomMapItem = {
				...input,
				id,
				displays: new Map(),
				label: input.label ?? '',
				ttl: Date.now()
			};

			// Fire off async (ignored) fn to clean up cache.
			try {
				void cleanupRoomMap();
			} catch (error) {
				console.warn('-------- Cleanup process error --------', error);
			}

			registerRoom(newDisplayMapItem);
			// no socket should be listening to a room that was just created.

			return newDisplayMapItem;
		}),
	list: publicProcedure.query(({ ctx: { getAllRooms } }) => getAllRooms()),
	update: publicProcedure.input(ZodRoom).mutation(function ({ ctx, input }) {
		const newRoom = ctx.updateRoom(input.id, { ...input, label: input.label ?? '' });

		const displays = Array.from(newRoom.displays.values());
		ctx.emitter.emit(newRoom.id, { ...newRoom, displays });

		return newRoom;
	}),
	reset: publicProcedure.input(z.object({ id: z.string() })).mutation(function ({ ctx, input }) {
		const updatedRoom = ctx.resetRoomCards(input.id);

		const displays = Array.from(updatedRoom.displays.values());
		ctx.emitter.emit(updatedRoom.id, { ...updatedRoom, displays });

		return updatedRoom;
	})
});
