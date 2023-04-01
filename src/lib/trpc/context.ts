import type { inferAsyncReturnType } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { EventEmitter } from 'events';
import { kebabStyle } from './kebabStyle';

const ee = new EventEmitter();

// TODO: maybe add an "auth ctx" for a room && display? hiding those routes?
export type Room = {
	id: string;
	label: string;
	name: string;
	showVotes: boolean;
};

export type Display = {
	name: string;
	cardValue: number;
	isHost: boolean;
};

/**
 * ttl is milliseconds left for this item to live.
 * Defaults to 24 hours.
 */
export type RoomMapItem = Room & {
	displays: Map<string, Display>;
	ttl: number;
};

const roomsMap = new Map<string, RoomMapItem>();

function registerRoom({ label, name, showVotes }: Omit<Room, 'id'>) {
	const id = kebabStyle(name);

	roomsMap.set(id, {
		displays: new Map(),
		id,
		label,
		showVotes,
		name,
		ttl: Date.now()
	});

	const newRoom = roomsMap.get(id);

	if (typeof newRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'registerRoom' });

	return newRoom;
}

function getAllRooms() {
	return Array.from(roomsMap.values());
}

function getRoomByName(roomName: string) {
	const id = kebabStyle(roomName);
	const maybeRoom = roomsMap.get(id);

	if (typeof maybeRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'getAllRooms' });

	const displays = Array.from(maybeRoom.displays.values());
	return { ...maybeRoom, displays };
}

function getRoomById(roomId: string) {
	const maybeRoom = roomsMap.get(roomId);

	if (typeof maybeRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'getRoomById' });

	const displays = Array.from(maybeRoom.displays.values());
	return { ...maybeRoom, displays };
}

function updateRoom(roomId: string, newRoom: Room) {
	const oldRoom = roomsMap.get(roomId);

	if (typeof oldRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'updateRoom' });

	const combinedRoom = {
		...oldRoom,
		...newRoom
	};

	roomsMap.set(combinedRoom.id, combinedRoom);

	const displays = Array.from(combinedRoom.displays.values());
	return { ...combinedRoom, displays };
}

function getDisplayInRoom(roomId: string, displayName: string) {
	const maybeRoom = getRoomById(roomId);

	if (typeof maybeRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'getDisplayInRoom' });

	return maybeRoom.displays.find((display) => display.name === displayName);
}

function addOrUpdateDisplay(roomId: string, display: Display) {
	const oldRoom = roomsMap.get(roomId);

	if (typeof oldRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'addOrUpdateDisplay' });

	const roomDisplays = Array.from(oldRoom.displays.values());

	const newDisplays = new Map();

	roomDisplays.forEach((display) => {
		newDisplays.set(display.name, {
			...display
		});
	});

	newDisplays.set(display.name, display);

	roomsMap.set(oldRoom.id, { ...oldRoom, displays: newDisplays });

	const updatedRoom = roomsMap.get(oldRoom.id);

	if (typeof updatedRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'addOrUpdateDisplay2' });

	const displays = Array.from(updatedRoom.displays.values());
	return { ...updatedRoom, displays };
}

function resetRoomCards(roomId: string) {
	const maybeRoom = roomsMap.get(roomId);

	if (typeof maybeRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'resetRoomCards' });

	const roomDisplays = Array.from(maybeRoom.displays.values());

	const newDisplays = new Map();

	roomDisplays.forEach((display) => {
		newDisplays.set(display.name, {
			...display,
			cardValue: 0
		});
	});

	roomsMap.set(roomId, { ...maybeRoom, displays: newDisplays });

	const updatedRoom = roomsMap.get(maybeRoom.id);

	if (typeof updatedRoom === 'undefined')
		throw new TRPCError({ code: 'NOT_FOUND', message: 'resetRoomCards2' });

	const displays = Array.from(updatedRoom.displays.values());
	return { ...updatedRoom, displays };
}

function removeRoomByName(roomName: string) {
	const id = kebabStyle(roomName);
	roomsMap.delete(id);
}

function removeRoomById(roomId: string) {
	roomsMap.delete(roomId);
}

function cleanupRoomMap() {
	const items = Array.from(roomsMap.values());
	const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

	items.forEach((item) => {
		if (item.ttl < twentyFourHoursAgo) {
			roomsMap.delete(item.id);
		}
	});
}

export async function createContext(opts: CreateHTTPContextOptions | CreateWSSContextFnOptions) {
	return {
		...opts,
		// context information
		emitter: ee,
		registerRoom,
		getAllRooms,
		getRoomByName,
		getRoomById,
		updateRoom,
		getDisplayInRoom,
		addOrUpdateDisplay,
		resetRoomCards,
		removeRoomByName,
		removeRoomById,
		cleanupRoomMap
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
