import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

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

function App() {
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


// TODO: connections after first will be observers
export default App;
