/*
 > PCE-TS - Web Implementation of Play eChess Engine
 > Code by SinisterIcy
 > Version ALPHA
 > Licensed under the GNU General Public License v3.0
 > Github: https://github.com/playeChess/PCE-TS
*/

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

export namespace PlayeChessEngine {
    export class Move {
        private StartCoords: [number, number];
        public get start_coords() : [number, number] {
            return this.StartCoords;
        }

        private EndCoords: [number, number];
        public get end_coords() : [number, number] {
            return this.EndCoords;
        }

        private IsCapture: boolean = false;
        public set is_capture(is_capture: boolean) {
            this.IsCapture = is_capture;
        }
        public get is_capture() : boolean {
            return this.IsCapture;
        }

        private IsValid: boolean = false;
        public set is_valid(is_valid: boolean) {
            this.IsValid = is_valid;
        }
        public get is_valid() : boolean {
            return this.IsValid;
        }

        constructor(start_square_x: number, start_square_y: number, end_square_x: number, end_square_y: number) {
            this.StartCoords = [start_square_x, start_square_y];
            this.EndCoords = [end_square_x, end_square_y];
        }

        public show() : string {
            let files = "abcdefgh";
            return files[this.start_coords[0]] + (this.start_coords[1] + 1) + " -> " + files[this.end_coords[0]] + (this.end_coords[1] + 1);
        }
    }

    export namespace board {

        export namespace pieces {

            export enum piece_type { p, r, n, b, q, k };

            export abstract class Piece {
                private Type: piece_type;
                public get type(): piece_type {
                    return this.Type;
                }
                protected set type(type: piece_type) {
                    this.Type = type;
                }

                private Coords: [number, number];
                public get coords(): [number, number] {
                    return this.Coords;
                }
                public set coords(coords: [number, number]) {
                    this.Coords = coords;
                }

                private IsWhite: boolean = true;
                public set is_white(is_white: boolean) {
                    this.IsWhite = is_white;
                }
                public get is_white() : boolean {
                    return this.IsWhite;
                }

                private HasMoved: boolean = false;
                public set has_moved(has_moved: boolean) {
                    this.HasMoved = has_moved;
                }
                public get has_moved() : boolean {
                    return this.HasMoved;
                }

                constructor(type: piece_type, is_white: boolean, x: number, y: number) {
                    this.type = type;
                    this.is_white = is_white;
                    this.coords = [x, y];
                }

                ChessBoard = [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]];

                public abstract validation_function(board: ChessBoard, x_final: number, y_final: number): boolean;

                public validate_validation(board: ChessBoard, x_final: number, y_final: number): boolean {
                    if(board[x_final][y_final] == undefined) {
                        return true;
                    }
                    if(board[x_final][y_final].is_white != this.is_white) {
                        return true;
                    }
                    return false;
                }

                public check_path(board: ChessBoard, x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if(x_diff == 0) {
                        if(y_diff > 0) {
                            for(let i = 1; i < y_diff; i++) {
                                if(board[this.coords[0]][this.coords[1] + i] != undefined) {
                                    return false;
                                }
                            }
                        } else {
                            for(let i = 0; i < Math.abs(y_diff); i++) {
                                if(board[this.coords[0]][this.coords[1] - i] != undefined) {
                                    return false;
                                }
                            }
                        }
                    } else if(y_diff == 0) {
                        if(x_diff > 0) {
                            for(let i = 1; i < x_diff; i++) {
                                if(board[this.coords[0] + i][this.coords[1]] != undefined) {
                                    return false;
                                }
                            }
                        } else {
                            for(let i = 0; i < Math.abs(x_diff); i++) {
                                if(board[this.coords[0] - i][this.coords[1]] != undefined) {
                                    return false;
                                }
                            }
                        }
                    } else if(Math.abs(x_diff) == Math.abs(y_diff)) {
                        if(x_diff > 0 && y_diff > 0) {
                            for(let i = 1; i < x_diff; i++) {
                                if(board[this.coords[0] + i][this.coords[1] + i] != undefined) {
                                    return false;
                                }
                            }
                        } else if(x_diff > 0 && y_diff < 0) {
                            for(let i = 1; i < x_diff; i++) {
                                if(board[this.coords[0] + i][this.coords[1] - i] != undefined) {
                                    return false;
                                }
                            }
                        } else if(x_diff < 0 && y_diff > 0) {
                            for(let i = 0; i < Math.abs(x_diff); i++) {
                                if(board[this.coords[0] - i][this.coords[1] + i] != undefined) {
                                    return false;
                                }
                            }
                        } else if(x_diff < 0 && y_diff < 0) {
                            for(let i = 0; i < Math.abs(x_diff); i++) {
                                if(board[this.coords[0] - i][this.coords[1] - i] != undefined) {
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                }

                public show(): string {
                    if(this.is_white) {
                        let piece_names: Array<string> = ["P", "N", "B", "R", "Q", "K"];
                        return piece_names[this.type];
                    }
                    let piece_names: Array<string> = ["p", "n", "b", "r", "q", "k"];
                    return piece_names[this.type];
                }

                public compare(other: Piece): boolean {
                    if(this.type == other.type && this.is_white == other.is_white && this.coords[0] == other.coords[0] && this.coords[1] == other.coords[1]) {
                        return true;
                    }
                    return false;
                }
            }

            type ChessBoard = [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]];

            export class Pawn extends Piece {
                constructor(is_white: boolean, x: number, y: number) {
                    super(piece_type.p, is_white, x, y);
                }

                public validation_function(board: ChessBoard, x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if(y_diff == 0 && x_diff != 0) {
                        if(this.is_white) {
                            if(x_diff == 1) {
                                if(board[x_final][y_final] == undefined) {
                                    return true;
                                } 
                            } else if(x_diff == 2) {
                                if(!this.has_moved && board[x_final][y_final] == undefined) {
                                    return true;
                                }
                            }
                        } else {
                            if(x_diff == -1) {
                                if(board[x_final][y_final] == undefined) {
                                    return true;
                                } 
                            } else if(x_diff == -2) {
                                if(!this.has_moved && board[x_final][y_final] == undefined) {
                                    return true;
                                }
                            }
                        }
                    } else if(Math.abs(x_diff) == 1 && Math.abs(y_diff) == 1) {
                        if(this.is_white) {
                            if(x_diff == 1 && y_diff == 1) {
                                if(board[x_final][y_final] != undefined && !board[x_final][y_final].is_white) {
                                    return true;
                                }
                            } else if(x_diff == 1 && y_diff == -1) {
                                if(board[x_final][y_final] != undefined && !board[x_final][y_final].is_white) {
                                    return true;
                                }
                            }
                        } else {
                            if(x_diff == -1 && y_diff == 1) {
                                if(board[x_final][y_final] != undefined && board[x_final][y_final].is_white) {
                                    return true;
                                }
                            } else if(x_diff == -1 && y_diff == -1) {
                                if(board[x_final][y_final] != undefined && board[x_final][y_final].is_white) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
            }

            export class Rook extends Piece {
                constructor(is_white: boolean, x: number, y: number) {
                    super(piece_type.r, is_white, x, y);
                }

                validation_function(board: ChessBoard, x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if(x_diff * y_diff == 0 && x_diff != y_diff) {
                        if(this.validate_validation(board, x_final, y_final)) {
                            return this.check_path(board, x_final, y_final);
                        }
                    }
                    return false;
                }
            }

            export class Knight extends Piece {
                constructor(is_white: boolean, x: number, y: number) {
                    super(piece_type.n, is_white, x, y);
                }

                public validation_function(board: ChessBoard, x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if((Math.abs(x_diff) == 2 && Math.abs(y_diff) == 1) || (Math.abs(x_diff) == 1 && Math.abs(y_diff) == 2)) {
                        return this.validate_validation(board, x_final, y_final);
                    }
                    return false;
                }
            }

            export class Bishop extends Piece {
                constructor(is_white: boolean, x: number, y: number) {
                    super(piece_type.b, is_white, x, y);
                }

                public validation_function(board: ChessBoard, x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if(Math.abs(x_diff) == Math.abs(y_diff) && x_diff != 0) {
                        if(this.validate_validation(board, x_final, y_final)) {
                            return this.check_path(board, x_final, y_final);
                        }
                    }
                    return false;
                }
            }

            export class Queen extends Piece {
                constructor(is_white: boolean, x: number, y: number) {
                    super(piece_type.q, is_white, x, y);
                }

                public validation_function(board: ChessBoard, x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if((Math.abs(x_diff) == Math.abs(y_diff) && x_diff != 0) || (x_diff * y_diff == 0 && x_diff != y_diff)) {
                        if(this.validate_validation(board, x_final, y_final)) {
                            return this.check_path(board, x_final, y_final);
                        }
                    }
                    return false;
                }
            }

            export class King extends Piece {
                constructor(is_white: boolean, x: number, y: number) {
                    super(piece_type.k, is_white, x, y);
                }

                public validation_function(board: ChessBoard, x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if(Math.abs(x_diff) <= 1 && Math.abs(y_diff) <= 1) {
                        return this.validate_validation(board, x_final, y_final);
                    }
                    return false;
                }
            }
        } // namespace pieces

        type ChessBoard = [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]];

        export class Board {
            private Board: ChessBoard;
            public set board(board: ChessBoard) {
                this.Board = board;
            }
            public get board(): ChessBoard {
                return this.Board;
            }

            private Boards: Array<Board>;
            public set boards(boards: Array<Board>) {
                this.Boards = boards;
            }
            public get boards(): Array<Board> {
                return this.Boards;
            }

            private Moves: Array<Move>;
            public set moves(moves: Array<Move>) {
                this.Moves = moves;
            }
            public get moves(): Array<Move> {
                return this.Moves;
            }

            private WhiteTurn: boolean = true;
            public set white_turn(whiteTurn: boolean) {
                this.WhiteTurn = whiteTurn;
            }
            public get white_turn(): boolean {
                return this.WhiteTurn;
            }

            constructor(fen:string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
                let fen_array: Array<string> = fen.split(" ");
                fen = fen_array[0];
                this.white_turn = fen_array[1] == "w";
                this.load_fen(fen);
            }

            public compare(other: Board): boolean {
                for(let i = 0; i < 8; i++) {
                    for(let j = 0; j < 8; j++) {
                        if(this.Board[i][j].compare(other.Board[i][j])) {
                            return false;
                        }
                    }
                }
                if(this.white_turn != other.white_turn) {
                    return false;
                }
                // come bak here
                return true;
            }

            public reverse_fen(fen: string): string {
                let fen_array: Array<string> = fen.split("/");
                let new_fen: string = "";
                for(let i = fen_array.length - 1; i >= 0; i--) {
                    new_fen += [...fen_array[i]].reverse().join('') + "/";
                }
                return new_fen;
            }

            public load_fen(fen: string): void {
                fen = this.reverse_fen(fen);
                let fen_arr = [...fen];
                let x: number = 0;
                let y: number = 0;
                fen_arr.forEach(c => {
                    if(c == "/") {
                        y = 0;
                        x++;
                    } else if(c == "8")
                        return;
                    else if(c >= "1" && c <= "8") {
                        y += c.charCodeAt(0) - "0".charCodeAt(0);
                    } else {
                        let is_white: boolean = c >= "A" && c <= "Z";
                        switch(c) {
                            case "P":
                            case "p":
                                this.Board[x][y] = new pieces.Pawn(is_white, x, y);
                                break;
                            case "R":
                            case "r":
                                this.Board[x][y] = new pieces.Rook(is_white, x, y);
                                break;
                            case "N":
                            case "n":
                                this.Board[x][y] = new pieces.Knight(is_white, x, y);
                                break;
                            case "B":
                            case "b":
                                this.Board[x][y] = new pieces.Bishop(is_white, x, y);
                                break;
                            case "Q":
                            case "q":
                                this.Board[x][y] = new pieces.Queen(is_white, x, y);
                                break;
                            case "K":
                            case "k":
                                this.Board[x][y] = new pieces.King(is_white, x, y);
                                break;
                        }
                        y++;
                    }
                });
            }

            public print_board(moves: Array<Array<number>> =[], board: ChessBoard = this.Board): void {
                let board_str: string = "";
                board_str += "  #-----------------#\n";
                for(let i = 0; i < 8; i++) {
                    board_str += (8 - i) + " | ";
                    for(let j = 0; j < 8; j++) {
                        let skip: boolean = false;
                        for(let k = 0; k < moves.length; k++) {
                            if(moves[k][0] == 7 - i && moves[k][1] == j) {
                                board_str += "* ";
                                skip = true;
                                break;
                            }
                        }
                        if(skip) continue;
                        if(board[7 - i][j] == undefined) {
                            board_str += "  ";
                        } else {
                            board_str += board[7 - i][j].show() + " ";
                        }
                    }
                    board_str += "|\n";
                }
                board_str += "  #-----------------#\n";
                board_str += "    a b c d e f g h\n";
                console.log(board_str);
            }

            public get_moves(x: number, y: number, from_premove:boolean = false): Array<Move> {
                let moves: Array<Move> = [];
                for(let i = 0; i < 8; i++) {
                    for(let j = 0; j < 8; j++) {
                        if(this.Board[i][j] == undefined) continue;
                        if(this.Board[i][j].is_white != this.white_turn) continue;
                        if(this.board[x][y].validation_function(this.board, i, j)) {
                            let move: Move = new Move(i, j, x, y);
                            if(from_premove) {
                                moves.push(move);
                                continue;
                            }
                            if(!this.premove_check(move, this.board[x][y].is_white))
                                moves.push(move);
                        }
                    }
                }
                return moves;
            }

            public get_all_moves(brd: ChessBoard, white:boolean, from_premove:boolean=false): Array<Move> {
                let moves: Array<Move> = [];
                for(let i = 0; i < 8; i++) {
                    for(let j = 0; j < 8; j++) {
                        if(brd[i][j] == undefined) continue;
                        if(brd[i][j].is_white != white) continue;
                        let tmp_moves: Array<Move> = this.get_moves(i, j, from_premove);
                        for(let k = 0; k < tmp_moves.length; k++) {
                            moves.push(tmp_moves[k]);
                        }
                    }
                }
                return moves;
            }

            public get_all_landing_moves(white:boolean, from_premove:boolean=false): Array<Array<number>> {
                let moves: Array<Array<number>> = [];
                for(let i = 0; i < 8; i++) {
                    for(let j = 0; j < 8; j++) {
                        if(this.board[i][j] == undefined) continue;
                        if(this.board[i][j].is_white != white) continue;
                        let tmp_moves: Array<Move> = this.get_moves(i, j, from_premove);
                        for(let k = 0; k < tmp_moves.length; k++) {
                            moves.push([tmp_moves[k].end_coords[0], tmp_moves[k].end_coords[1]]);
                        }
                    }
                }
                return moves;
            }

            public is_check(white:boolean): boolean {
                let moves = this.get_all_landing_moves(!white, true);
                for(let i = 0; i < moves.length; i++) {
                    if(this.board[moves[i][0]][moves[i][1]].type == 5)
                        return true;
                }
                return false;
            }

            public transfer_piece(start_coords: [number, number], end_coords: [number, number]): void {
                let tmp = this.board[start_coords[0]][start_coords[1]];
                this.board[start_coords[0]][start_coords[1]] = this.board[end_coords[0]][end_coords[1]];
                this.board[end_coords[0]][end_coords[1]] = tmp;
                this.board[start_coords[0]][start_coords[1]].coords = start_coords;
                this.board[end_coords[0]][end_coords[1]].coords = end_coords;
                delete this.board[start_coords[0]][start_coords[1]];
            }

            // Variant
            public premove_check(move: Move, white:boolean): boolean {
                let tmp_board = this.board;
                this.transfer_piece(move.start_coords, move.end_coords);
                let is_check = this.is_check(white);
                this.board = tmp_board;
                return is_check;
            }

            public move(move: Move, white: boolean): Move {
                if(this.board[move.start_coords[0]][move.start_coords[1]] == undefined) {
                    move.is_valid = false;
                    return move;
                } if(this.board[move.start_coords[0]][move.start_coords[1]].is_white != white) {
                    move.is_valid = false;
                    return move;
                } if(this.get_moves(move.start_coords[0], move.start_coords[1]).includes(move)) {
                    move.is_capture = this.board[move.end_coords[0]][move.end_coords[1]] != undefined;
                    this.transfer_piece(move.start_coords, move.end_coords);
                    move.is_valid = true;
                }
                let start_ep_coords = this.get_en_passant(this.moves, white);
                if(start_ep_coords.toString() === [move.start_coords[0], move.start_coords[1]].toString()) {
                    let side = this.moves[this.moves.length-1].end_coords[0] - start_ep_coords[0];
                    let offset = white ? 1 : -1;
                    if(move.end_coords[0] == start_ep_coords[0] + offset && move.end_coords[1] == start_ep_coords[1] + side) {
                        this.en_passant(start_ep_coords, [start_ep_coords[0] + offset, start_ep_coords[1] + side], white);
                        move.is_valid = true;
                        move.is_capture = true;
                        return move;
                    }
                }
                move.is_valid = false;
                return move;
            }

            public status(white: boolean): number {
                if(this.get_all_moves(this.board, white).length == 0) {
                    if(this.is_check(white)) return 1;
                    else return 2;
                }
                return 0
            }

            public insufficient_material(): boolean {
                let num_knights: number = 0;
                let num_bishops: number = 0;
                this.board.forEach(row => {
                    row.forEach(piece => {
                        if(piece == undefined) return;
                        switch(piece.type) {
                            case pieces.piece_type.p:
                                return false;
                            case pieces.piece_type.n:
                                num_knights++;
                                break;
                            case pieces.piece_type.b:
                                num_bishops++;
                                break;
                            case pieces.piece_type.r:
                            case pieces.piece_type.q:
                                return false;
                            default: break;
                        }
                        return;
                    })
                });
                if(num_knights == 0 && num_bishops == 0) 
                    return true;
                return false;
            }

            public can_castle(white: boolean, kingside: boolean): boolean {
                let row = white ? 7 : 0;
                let king = this.board[row][4];
                if(king == undefined) return false;
                if(king.has_moved) return false;
                let rook = this.board[row][kingside ? 7 : 0];
                if(rook == undefined) return false;
                if(rook.has_moved) return false;
                let start = kingside ? 5 : 1;
                let end = kingside ? 7 : 3;
                for(let i = start; i < end; i++) {
                    if(this.board[row][i] != undefined || this.get_all_landing_moves(!white).includes([row, i])) return false;
                }
                return true;
            }

            public castle(white: boolean, kingside: boolean): void {
                let row = white ? 7 : 0;
                let king = this.board[row][4];
                let rook = this.board[row][kingside ? 7 : 0];
                this.transfer_piece([row, 4], [row, kingside ? 6 : 2]);
                this.transfer_piece([row, kingside ? 7 : 0], [row, kingside ? 5 : 3]);
            }

            public get_promotion(white: boolean): [number, number] {
                let row = white ? 0 : 7;
                for(let i = 0; i < 8; i++) {
                    if(this.board[row][i] != undefined) {
                        if(this.board[row][i].type == pieces.piece_type.p && this.board[row][i].is_white == white)
                            return [row, i];
                    }
                }
                return [-1, -1];
            }

            public promote(white: boolean, type: pieces.piece_type): void {
                let [row, col] = this.get_promotion(white);
                if(row == -1 || col == -1) return;
                if(type == pieces.piece_type.r)
                    this.board[row][col] = new pieces.Rook(white, row, col);
                else if(type == pieces.piece_type.n)
                    this.board[row][col] = new pieces.Knight(white, row, col);
                else if(type == pieces.piece_type.b)
                    this.board[row][col] = new pieces.Bishop(white, row, col);
                else if(type == pieces.piece_type.q)
                    this.board[row][col] = new pieces.Queen(white, row, col);
            }

            public check_threefold_repetition(boards: Array<Board>,white: boolean): boolean {
                let count = 1;
                for(let i = 0; i < boards.length; i++) {
                    if(this.compare(boards[i]) && ((i % 2 == 0) == white))
                    count++;
                }
                return count >= 3;
            }

            public get_en_passant_side(last_move: Move, white: boolean, side: number, offset: number): [number, number] {
                if(last_move.end_coords[1] + side < 0 || last_move.end_coords[1] + side > 7) return [-1, -1];
                if(this.board[last_move.end_coords[0]][last_move.end_coords[1] + side] != undefined) {
                    let ep_piece: pieces.Piece = this.board[last_move.end_coords[0]][last_move.end_coords[1] + side];
                    if(ep_piece.type == pieces.piece_type.p && ep_piece.is_white == white)
                        return [last_move.end_coords[0] + offset, last_move.end_coords[1] + side];
                }
                return [-1, -1];
            }

            public get_en_passant(moves: Array<Move>, white: boolean): [number, number] {
                if(moves.length == 0) return [-1, -1];
                let last_move = moves[moves.length-1];
                let offset: number = white ? -2 : 2;
                let moved_piece = this.board[last_move.end_coords[0]][last_move.end_coords[1]];
                if(last_move.end_coords[0] == last_move.start_coords[0] + offset && moved_piece.type == pieces.piece_type.p && moved_piece.is_white == white) {
                    let tmp: [number, number] = this.get_en_passant_side(last_move, white, -1, offset);
                    if(tmp.toString() != [-1, -1].toString())
                        return tmp;
                    return this.get_en_passant_side(last_move, white, 1, offset);
                }
                return [-1, -1];
            }

            public en_passant(start_coords: [number, number], end_coords: [number, number], white: boolean): void {
                this.transfer_piece(start_coords, end_coords);
            }
        }
    } // namespace board

    export class PCE {
        private moves: Array<Move>;
        private boards: Array<board.Board>;
        private board: board.Board;
        private move_countdown: number = 50;

        public async move(white: boolean) {
            console.clear();
            this.board.moves = this.moves;
            this.board.boards = this.boards;
            this.board.white_turn = white;
            if(white)
                console.log("> White to play <");
            else
                console.log("> Black to play <");
            let color_moves = this.board.get_all_moves(this.board.board, white);
            for(let move of color_moves) {
                console.log(move.show());
            }
            this.board.print_board(this.board.get_all_landing_moves(white));
            let valid:boolean = false;
            while(!valid) {
                let move: string = '';
                do {
                    let move = await rl.question('> ');
                } while (move.length != 4 && move != "exit" && move != "O-O" && move != "O-O-O");
                if(move == 'exit')
                    return true;
                if(move == "O-O") {
                    if(this.board.can_castle(white, true)) {
                        this.board.castle(white, true);
                        return false;
                    }
                }
                if(move == "O-O-O") {
                    if(this.board.can_castle(white, false)) {
                        this.board.castle(white, false);
                        return false;
                    }
                }

                let move_obj = new Move(move.charCodeAt(1) - '1'.charCodeAt(0), move.charCodeAt(0) - 'a'.charCodeAt(0), move.charCodeAt(3) - '1'.charCodeAt(0), move.charCodeAt(2) - 'a'.charCodeAt(0));
                let type = this.board.board[move_obj.start_coords[0]][move_obj.start_coords[1]].type;

                move_obj = this.board.move(move_obj, white);
                valid = move_obj.is_valid;

                if (valid) {
                    this.moves.push(move_obj);
                    this.boards.push(this.board);
                }

                if(!move_obj.is_capture || type == board.pieces.piece_type.p)
                    this.move_countdown = 50;
                else
                    this.move_countdown--;

                if(type == board.pieces.piece_type.p) {
                    if(this.board.get_promotion(white).toString() != [-1, -1].toString()) {
                        let promotion: string = '';
                        do {
                            promotion = await rl.question('Promote to (Q, R, B, N): ');
                        } while (promotion != "Q" && promotion != "R" && promotion != "B" && promotion != "N");
                        let promotion_type = board.pieces.piece_type.q;
                        if(promotion == "R")
                            promotion_type = board.pieces.piece_type.r;
                        else if(promotion == "B")
                            promotion_type = board.pieces.piece_type.b;
                        else if(promotion == "N")
                            promotion_type = board.pieces.piece_type.n;
                        this.board.promote(white, promotion_type);
                    }
                }
            }
            return false;
        }

        public constructor(fen:string="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
            this.board = new board.Board(fen);
        }

        public async main() {
            let move_count = 0;
            let break_loop = false;
            this.boards.push(this.board);
            while(true) {
                let white = move_count % 2 == 0;
                break_loop = await this.move(white);
                if(break_loop)
                    break;
                if(this.board.status(!white) == 1) {
                    console.clear();
                    this.board.print_board();
                    if(white)
                        console.log("White wins (checkmate)");
                    else
                        console.log("Black wins (checkmate)");
                    break;
                } else if(this.board.status(!white) == 2) {
                    console.clear();
                    this.board.print_board();
                    console.log("Draw (stalemate)");
                    break;
                } else if (this.board.insufficient_material()) {
                    console.clear();
                    this.board.print_board();
                    console.log("Draw (insufficient material)");
                    break;
                } else if(this.move_countdown == 0) {
                    console.clear();
                    this.board.print_board();
                    console.log("Draw (50 move rule)");
                    break;
                } else if(this.board.check_threefold_repetition(this.boards, white)) {
                    console.clear();
                    this.board.print_board();
                    console.log("Draw (threefold repetition)");
                    break;
                }
                move_count++;
            }
            for (let i = 0; i < this.moves.length; i += 2) {
                if(i + 1 < this.moves.length)
                    console.log(i / 2 + 1 + "... " + this.moves[i].show() + " " + this.moves[i + 1].show());
            }
        }
    }
} // namespace PlayeChessEngine

/**
 * Fonctionnement
 * 
 * export classe PCE:
 * 
 * isDraw() -> [bool, (type: string)]
 * isLegal() -> [bool, (board: array 2D)]
 * isWon() -> bool, team: string
 * 
 * getMoves() -> array 2D
 * move(start_pos, end_pos)
 * 
 */
