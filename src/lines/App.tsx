import React, {useState, useEffect, useRef} from 'react';
import Peer from 'peerjs';

import ai from './ai';

function newBoard(size: number): number[][] {
    const line1 = [2, ...[...new Array(size)].map((x, i) => i % 2 ? 1 : 0), 2];
    const line2 = [2, ...[...new Array(size)].map((x, i) => i % 2 ? 0 : 2), 2];
    const board = [...new Array(size)].map((x, i) => i % 2 ? line1 : line2);
    return [
        [1, ...[...new Array(size)].map(x => 1), 2],
        ...board,
        [2, ...[...new Array(size)].map(x => 1), 1],
    ];
}

type clickHandler = (row: number, col: number) => void;

function renderTile(tile: number, row: number, col: number, onClick: clickHandler)
{
    const color = tile == 0 ? "white" : tile == 2 ? "red" : "blue";

    return <span style={{background: color, gridRow: row + 1, gridColumn: col + 1, border: "1px solid black"}} onClick={(e) => onClick(row, col)}></span>
}

function renderLine(line: number[], row: number, onClick: clickHandler)
{
    return <>
        {line.map((x, col) => renderTile(x, row, col, onClick))}
    </>
}

type PeerOpts = {
    onConnection: (coon: Peer.DataConnection) => void,
};

function usePeer(opts: PeerOpts): [ Peer | undefined, (peerId: string) => void ]
{
    let [ peer, setPeer ] = useState<Peer | undefined>(undefined);
    let [ init, setInit ] = useState(false);
    let onConnection = useRefCallback(opts.onConnection);

    useEffect(() => {
        const newPeer = new Peer();
        newPeer.on('open', () => {
            setInit(true);
        });

        setPeer(newPeer);

        newPeer.on('connection', conn => {
            conn.on('open', () => {
                onConnection(conn);
            });
        });

        return () => {
            if (peer)
                peer.destroy();
        }
    }, []);

    function connect(peerId: string)
    {
        if (!peer)
            return;
        const conn = peer.connect(peerId);
        conn.on('open', () => {
            onConnection(conn);
        });
    }

    return [
        init ? peer : undefined,
        connect,
    ];
}

function removeHash()
{
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
}

function useRefCallback<F extends Function>(f: F): F
{
    let ref = useRef<F>(f);

    useEffect(() => {
        ref.current = f;
    }, [f]);

    let r = (...args: any[]) => ref.current(...args);
    return r as any as F;
}

function App() {
    let [board, setBoard]= useState(newBoard(6));
    let [player, setPlayer] = useState(1);
    let [other, setOther] = useState('');
    let [text, setText] = useState('');
    let [yourTurn, setYourTurn] = useState(true);
    let [connection, setConnection] = useState<Peer.DataConnection | undefined>(undefined);

    let [callbacks] = useState<any>({});
    let onData = useRefCallback(({row, col}: any) => {
        const nb = JSON.parse(JSON.stringify(board));
        nb[row][col] = player;
        setBoard(nb);
        setPlayer(3 - player);
        setYourTurn(true);
    });
    let [ peer, connect ] = usePeer({
        onConnection: (conn: Peer.DataConnection) => {
            if (!connection)
                setConnection(conn);
            conn.on('data', onData);
        },
    });

    useEffect(() => {
        let hash = window.location.hash;
        let match = hash.match(/^#connect=(.*)/);
        if (peer && match) {
            connect(match[1]);
            removeHash();
        };
    }, [ peer ]);

    function onClick(row: number, col: number) {
        if (!connection)
            return;
        if (board[row][col] != 0)
            return;
        if (!yourTurn)
            return;
        const nb = JSON.parse(JSON.stringify(board));
        nb[row][col] = player;
        setBoard(nb);
        setPlayer(3 - player);
        setYourTurn(false)
        connection.send({ row, col });
        //alert(`${row}x${col}`);
    }

    return (
        <div className="App">
            <div>v0.42.1</div>
            {connection ? 'Connected' : peer ? <a href={window.location + '#connect=' + peer.id} target="_blank">Share</a> : 'Initializing...'}
            <br/>
            {yourTurn ? 'Your' : 'Opponent'} ({player == 1 ? 'Blue' : 'Red'}) Move
            {/*<input type="text" onChange={(e) => setOther(e.target.value)}/><button onClick={() => connect(peer.connect(other))}>Connect</button>*/}
            {/*<input type="text" onChange={(e) => setText(e.target.value)}/><button onClick={() => { setYourTurn(false); conn.send(text); setText(''); } }>Send</button>*/}
            <div style={{ display: 'grid', width: '700px', height: '700px' }}>
                {board.map((x, i) => renderLine(x, i, onClick))}
            </div>
            <br/>
            {ai(player, board)}
        </div>
    );
}

export default App;
