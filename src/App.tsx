import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Peer from 'peerjs';

import {
    Piece,
    BoardPiece,
    Player,
    Position,
    Board,
    startBoard,
    allPositions,
} from './game';

type BoardEmpty = {
    piece: 'empty';
}

type BoardCell = BoardPiece | BoardEmpty;
type BoardFile = [ BoardCell, BoardCell, BoardCell, BoardCell, BoardCell, BoardCell, BoardCell, BoardCell, BoardCell ];

type GameState = {
    board: Board;
};

function renderSpear({ style }: { style: Object })
{
    return <>
        <line x1="50" y1="15" x2="50" y2="85" style={style} />
        <line x1="50" y1="15" x2="40" y2="55" style={style} />
        <line x1="40" y1="55" x2="50" y2="65" style={style} />
        <line x1="50" y1="15" x2="60" y2="55" style={style} />
        <line x1="60" y1="55" x2="50" y2="65" style={style} />
        <line x1="40" y1="85" x2="60" y2="85" style={style} />
    </>;
}

function renderBishop({ style }: { style: Object })
{
    return <>
        <rect x="20" y="75" width="60" height="10" fill="transparent" style={style} />
        <rect x="30" y="65" width="40" height="10" fill="transparent" style={style} />
        <rect x="45" y="35" width="10" height="30" fill="transparent" style={style} />
    </>;
}


function renderRook({ style }: { style: Object })
{
    return <>
        <rect x="20" y="75" width="60" height="10" fill="transparent" style={style} />
        <rect x="32" y="35" width="36" height="40" fill="transparent" style={style} />
        <rect x="25" y="25" width="50" height="10" fill="transparent" style={style} />
        <rect x="25" y="15" width="10" height="10" fill="transparent" style={style} />
        <rect x="45" y="15" width="10" height="10" fill="transparent" style={style} />
        <rect x="65" y="15" width="10" height="10" fill="transparent" style={style} />
    </>;
}

function renderPiece(piece?: Piece)
{
    const pieceRenderers: any = {
        [Piece.Spear ]: renderSpear ,
        [Piece.Rook  ]: renderRook  ,
        [Piece.Bishop]: renderBishop,
        "": () => null,
    };
    const style = {stroke:"rgb(255,0,0)",strokeWidth:"2"};
    const svg = pieceRenderers[piece || ""]?.({ style: {} });
    return  <svg height="100%" width="100%" style={style}>
        {svg}
    </svg>;
}


function renderCell(o: { piece?: BoardPiece, position: Position })
{
    const whiteCell = (o.position.y + o.position.x) % 2 == 0;

    const cellStyle = {
        gridRow: o.position.y + 1,
        gridColumn: o.position.x + 1,
        background: whiteCell ? 'grey' : 'lightgrey',
        width: '100px',
        height: '100px',
    };

    const pieceRenderers: any = {
        [Piece.Spear]: renderSpear,
        "": () => null,
    };
    const style = {stroke:"rgb(255,0,0)",strokeWidth:"2"};
    const svg = pieceRenderers[o.piece?.piece || ""]?.({ style });

    return <div style={cellStyle}>
        {renderPiece(o.piece?.piece)}
    </div>;

            //{allPositions().map(({ x, y }) => <div style={{ gridRow: y + 1, gridColumn: x + 1 }}>{JSON.stringify(s[`${x}x${y}`] || {})}</div>)}
}

function AppShogi() {
  let s: Board = startBoard();
  console.log(s);

  allPositions().map(({ x, y }) => <div>{x}-{y}</div>);
  console.log([...new Array(9)].map((_1, y) => [...new Array(9)].map((_2, x) => ({ x, y }))).flat());

  return (
    <div className="App">
        <div style={{ display: 'grid', width: '900px', height: '900px' }}>
            {allPositions().map(({ x, y }) => renderCell({ position: { x, y }, piece: s[`${x}x${y}`]}))}
        </div>
    </div>
  );
}

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

// TODO: connections after first will be observers
export default App;
