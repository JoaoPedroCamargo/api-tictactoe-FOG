"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayersInRoom = exports.getPlayer = exports.removePlayer = exports.addPlayer = void 0;
const players = [];
const addPlayer = ({ id, symbol, room }) => {
    const isRoomFull = players.filter(player => player.room === room).length;
    if (isRoomFull === 2) {
        return { error: 'Room full' };
    }
    const newPlayer = { id, symbol, room };
    players.push(newPlayer);
    return { newPlayer };
};
exports.addPlayer = addPlayer;
const removePlayer = (id) => {
    const removeIndex = players.findIndex(player => player.id === id);
    if (removeIndex != -1) {
        return players.splice(removeIndex, 1)[0];
    }
};
exports.removePlayer = removePlayer;
const getPlayer = (id) => {
    return players.find(player => player.id === id);
};
exports.getPlayer = getPlayer;
const getPlayersInRoom = (room) => {
    return players.filter(player => player.room === room);
};
exports.getPlayersInRoom = getPlayersInRoom;
//# sourceMappingURL=players.js.map