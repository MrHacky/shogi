import React, {useState} from 'react';
import Peer from 'peerjs';

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
    const color = tile == 0 ? "white" : tile == 2 ? "green" : "blue";

    return <span style={{background: color, gridRow: row + 1, gridColumn: col + 1, border: "1px solid black"}} onClick={(e) => onClick(row, col)}></span>
}

function renderLine(line: number[], row: number, onClick: clickHandler)
{
    return <>
        {line.map((x, col) => renderTile(x, row, col, onClick))}
    </>
}

const peer = new Peer();
let conn: any = null;
let othercb: any = null;
function connect(c: any) {
    conn = c;
    c.on('open', () => {
        c.on('data', function(data: any) {
            if (othercb)
                othercb(data);
            //alert(JSON.stringify(data));
        })
    });
};

peer.on('connection', (c) => {
    if (!conn)
        connect(c);
});

function App() {
    let [board, setBoard]= useState(newBoard(42));
    let [player, setPlayer] = useState(1);
    let [other, setOther] = useState('');
    let [text, setText] = useState('');
    let [yourTurn, setYourTurn] = useState(true);

    function onClick(row: number, col: number) {
        if (board[row][col] != 0)
            return;
        if (!yourTurn)
            return;
        const nb = JSON.parse(JSON.stringify(board));
        nb[row][col] = player;
        setBoard(nb);
        setPlayer(3 - player);
        setYourTurn(false)
        conn.send({ row, col });
        //alert(`${row}x${col}`);
    }

    othercb = ({row, col}: any) => {
        const nb = JSON.parse(JSON.stringify(board));
        nb[row][col] = player;
        setBoard(nb);
        setPlayer(3 - player);
        setYourTurn(true);
	};

    console.log(peer.id);

  return (
    <div className="App">
        <div>v0.42</div>
        {peer.id}
        <input type="text" onChange={(e) => setOther(e.target.value)}/><button onClick={() => connect(peer.connect(other))}>Connect</button>
        {/*<input type="text" onChange={(e) => setText(e.target.value)}/><button onClick={() => { setYourTurn(false); conn.send(text); setText(''); } }>Send</button>*/}
        <div style={{ display: 'grid', width: '800px', height: '800px' }}>
            {board.map((x, i) => renderLine(x, i, onClick))}
        </div>
    </div>
  );
}

export default App;
