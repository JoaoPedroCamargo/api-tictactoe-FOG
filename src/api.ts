import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

import router from './router'; 

import { addPlayer, getPlayersInRoom, removePlayer } from './players'

type IGrid = 'X' | 'O'

interface GridProps {
    Room: string;
    Grid: IGrid;
    CurrentTurn: IGrid;
}

const port = process.env.PORT || 3333;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
    },
});

app.use(cors());
app.use(router);

io.on('connection', (socket: Socket) => {
    
    socket.on('joinRoom', (room: string, callback: Function) => {
        const playersInRoom = getPlayersInRoom(room);
        var numberOfPlayersInRoom;

        if(playersInRoom === undefined) {
            numberOfPlayersInRoom = 0
        } else {
            numberOfPlayersInRoom = playersInRoom.length
        }

        const { error, newPlayer } = addPlayer({
            id: socket.id,
            symbol:  numberOfPlayersInRoom === 0 ? 'X' : 'O',
            room: room
        });
        
        if(error) {
            return callback(error)
        } else if(newPlayer){
            socket.join(newPlayer.room);

            io.to(newPlayer.room).emit('roomData', {
                room: newPlayer.room, 
                Players: getPlayersInRoom(newPlayer.room)
            });

            socket.emit('currentPlayerData', { symbol: newPlayer.symbol });

            callback();
        }
    })


    socket.on('updateGrid', ({ Room, Grid, CurrentTurn }: GridProps) => {
            io.to(Room).emit('updatedGrid', {Grid, CurrentTurn: CurrentTurn === 'X' ? 'O' : 'X'});
    })

    socket.on('disconnect', () => {
        removePlayer(socket.id);
    })
})

server.listen(port, () => console.log('Server has started.'));
