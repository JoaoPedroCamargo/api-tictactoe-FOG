"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const players_1 = require("./players");
const port = process.env.PORT || 3333;
const app = express_1.default();
const server = http_1.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
    },
});
app.use(cors_1.default());
app.use(router_1.default);
io.on('connection', (socket) => {
    socket.on('joinRoom', (room, callback) => {
        const playersInRoom = players_1.getPlayersInRoom(room);
        var numberOfPlayersInRoom;
        if (playersInRoom === undefined) {
            numberOfPlayersInRoom = 0;
        }
        else {
            numberOfPlayersInRoom = playersInRoom.length;
        }
        const { error, newPlayer } = players_1.addPlayer({
            id: socket.id,
            symbol: numberOfPlayersInRoom === 0 ? 'X' : 'O',
            room: room
        });
        if (error) {
            return callback(error);
        }
        else if (newPlayer) {
            socket.join(newPlayer.room);
            io.to(newPlayer.room).emit('roomData', {
                room: newPlayer.room,
                Players: players_1.getPlayersInRoom(newPlayer.room)
            });
            socket.emit('currentPlayerData', { symbol: newPlayer.symbol });
            callback();
        }
    });
    socket.on('updateGrid', ({ Room, Grid, CurrentTurn }) => {
        io.to(Room).emit('updatedGrid', { Grid, CurrentTurn: CurrentTurn === 'X' ? 'O' : 'X' });
    });
    socket.on('disconnect', () => {
        players_1.removePlayer(socket.id);
    });
});
server.listen(port, () => console.log('Server has started.'));
//# sourceMappingURL=api.js.map