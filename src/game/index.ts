export type Position = {
    x: number;
    y: number;
};

export enum Piece {
    Pawn = 'pawn',
    Spear = 'spear',
    Knight = 'knight',
    Silver = 'silver',
    Gold = 'gold',
    Bishop = 'bishop',
    Rook = 'rook',
    King = 'king',
};

export enum Player {
    White = 'white',
    Black = 'black',
};

export type BoardPiece = {
    piece: Piece,
    promoted: boolean,
    player: Player,
}

export type Board = {
    [key: string]: BoardPiece;
};

export function emptyBoard() {
    return {};
}

export function startBoard() {
    return {
        '0x0': { piece: Piece.Spear , promoted: false, player: Player.White },
        '1x0': { piece: Piece.Knight, promoted: false, player: Player.White },
        '2x0': { piece: Piece.Silver, promoted: false, player: Player.White },
        '3x0': { piece: Piece.Gold  , promoted: false, player: Player.White },
        '4x0': { piece: Piece.King  , promoted: false, player: Player.White },
        '5x0': { piece: Piece.Gold  , promoted: false, player: Player.White },
        '6x0': { piece: Piece.Silver, promoted: false, player: Player.White },
        '7x0': { piece: Piece.Knight, promoted: false, player: Player.White },
        '8x0': { piece: Piece.Spear , promoted: false, player: Player.White },
        '1x1': { piece: Piece.Rook  , promoted: false, player: Player.White },
        '7x1': { piece: Piece.Bishop, promoted: false, player: Player.White },
        '0x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '1x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '2x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '3x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '4x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '5x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '6x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '7x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '8x2': { piece: Piece.Pawn  , promoted: false, player: Player.White },
        '0x8': { piece: Piece.Spear , promoted: false, player: Player.Black },
        '1x8': { piece: Piece.Knight, promoted: false, player: Player.Black },
        '2x8': { piece: Piece.Silver, promoted: false, player: Player.Black },
        '3x8': { piece: Piece.Gold  , promoted: false, player: Player.Black },
        '4x8': { piece: Piece.King  , promoted: false, player: Player.Black },
        '5x8': { piece: Piece.Gold  , promoted: false, player: Player.Black },
        '6x8': { piece: Piece.Silver, promoted: false, player: Player.Black },
        '7x8': { piece: Piece.Knight, promoted: false, player: Player.Black },
        '8x8': { piece: Piece.Spear , promoted: false, player: Player.Black },
        '7x7': { piece: Piece.Rook  , promoted: false, player: Player.Black },
        '1x7': { piece: Piece.Bishop, promoted: false, player: Player.Black },
        '0x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
        '1x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
        '2x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
        '3x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
        '4x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
        '5x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
        '6x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
        '7x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
        '8x6': { piece: Piece.Pawn  , promoted: false, player: Player.Black },
    };
}

export function allPositions(): Position[]
{
    return [...new Array(9)].map((_1, y) => [...new Array(9)].map((_2, x) => ({ x, y }))).flat();
}
