import React from 'react';
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

function renderCell(o: { piece?: BoardPiece, position: Position })
{

    const whiteCell = (o.position.y + o.position.x) % 2 == 0;

    const style = {
        gridRow: o.position.y + 1,
        gridColumn: o.position.x + 1,
        background: whiteCell ? 'grey' : 'lightgrey',
        width: '100px',
        height: '100px',
    };

    return <div style={style}>
        {JSON.stringify(o.piece?.piece)}
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
