const players: IPlayer[] = []; 

interface IPlayer {
    id: string;
    symbol: 'X' | 'O';
    room: string;
}

export const addPlayer = ({ id, symbol, room }: IPlayer): { newPlayer?: IPlayer, error?: string } => {
    const isRoomFull = players.filter(player => player.room === room).length

    if(isRoomFull === 2){
        return { error: 'Room full' };
    }

    const newPlayer = { id, symbol, room };

    players.push(newPlayer);
    return { newPlayer }
}   

export const removePlayer = (id: String) => {
    const removeIndex = players.findIndex(player => player.id === id)

    if(removeIndex != -1){
        return players.splice(removeIndex, 1)[0];
    }
}

export const getPlayer = (id: string) => {
    return players.find(player => player.id === id);
}

export const getPlayersInRoom = (room: string) => {
    return players.filter(player => player.room === room);
}

