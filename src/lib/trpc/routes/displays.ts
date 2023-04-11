import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

/**
 * @param id - name & roomId kebab-style
 * @param roomId - kebab-style
 */
const ZodDisplay = z.object({
	name: z.string().min(1),
	cardValue: z.number(),
	isHost: z.boolean()
});

export const displaysRouter = router({
	create: publicProcedure
		.input(z.object({ display: ZodDisplay, roomId: z.string() }))
		.mutation(({ input, ctx }) => {
			const maybeDisplay = ctx.getDisplayInRoom(input.roomId, input.display.name);

			if (maybeDisplay !== undefined)
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'This value already exists'
				});

			const updatedRoom = ctx.addOrUpdateDisplay(input.roomId, input.display);

			const displays = Array.from(updatedRoom.displays.values());
			ctx.emitter.emit(updatedRoom.id, { ...updatedRoom, displays });

			return updatedRoom;
		}),
	createOrUpdate: publicProcedure
		.input(z.object({ display: ZodDisplay, roomId: z.string() }))
		.mutation(function ({ input, ctx }) {
			const updatedRoom = ctx.addOrUpdateDisplay(input.roomId, input.display);

			const displays = Array.from(updatedRoom.displays.values());
			ctx.emitter.emit(updatedRoom.id, { ...updatedRoom, displays });

			return updatedRoom;
		}),
	// byName: publicProcedure
	//   .input(
	//     z.object({
	//       name: z.string(),
	//       roomId: z.string(),
	//     })
	//   )
	//   .query(function ({ input, ctx }): Display {
	//     const { roomsMap } = ctx;

	//     const room = roomsMap.get(input.roomId);

	//     if (room === undefined)
	//       throw new TRPCError({
	//         code: 'NOT_FOUND',
	//         message: `Room not found with ID: ${input.roomId}`,
	//       });

	//     const displays = Array.from(room.displays.values());

	//     const display = displays.find((display) => display.name === input.name);

	//     if (display === undefined)
	//       throw new TRPCError({
	//         code: 'NOT_FOUND',
	//         message: `Display not found with name: ${input.name}`,
	//       });

	//     return display;
	//   }),
	// byId: publicProcedure
	//   .input(
	//     z.object({
	//       roomId: z.string(),
	//       id: z.string(),
	//     })
	//   )
	//   .query(function ({ input, ctx }): Display {
	//     const { roomsMap } = ctx;

	//     const room = roomsMap.get(input.roomId);

	//     if (room === undefined)
	//       throw new TRPCError({
	//         code: 'NOT_FOUND',
	//         message: `Room not found with ID: ${input.roomId}`,
	//       });

	//     const display = room.displays.get(input.id);

	//     if (display === undefined)
	//       throw new TRPCError({
	//         code: 'NOT_FOUND',
	//         message: `Display not found with ID: ${input.id}`,
	//       });

	//     return display;
	//   }),
	listByRoom: publicProcedure
		.input(
			z.object({
				roomId: z.string()
			})
		)
		.query(function ({ input, ctx: { getRoomById } }) {
			const room = getRoomById(input.roomId);

			if (room === undefined)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: `Room not found with ID: ${input.roomId}`
				});

			const displays = Array.from(room.displays.values());

			return displays;
		}),
	update: publicProcedure
		.input(z.object({ display: ZodDisplay, roomId: z.string() }))
		.mutation(function ({ ctx, input }) {
			const updatedRoom = ctx.addOrUpdateDisplay(input.roomId, input.display);

			const displays = Array.from(updatedRoom.displays.values());
			ctx.emitter.emit(updatedRoom.id, { ...updatedRoom, displays });

			return updatedRoom;
		})

	// socket: publicProcedure
	//   .input(z.object({ roomId: z.string() }))
	//   .subscription(({ ctx, input }) => {
	//     return observable<RoomMapItem>((emit) => {
	//       const socketKey = SocketKeys.displays + '-' + input.roomId;

	//       function onDisplayUpdate(data: RoomMapItem) {
	//         emit.next(data);
	//       }

	//       ctx.emitter.on(socketKey, onDisplayUpdate);

	//       return () => {
	//         ctx.emitter.off(socketKey, onDisplayUpdate);
	//       };
	//     });
	//   }),
});
