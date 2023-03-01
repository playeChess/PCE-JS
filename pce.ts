/*
 > PCE-TS - Web Implementation of Play eChess Engine
 > Code by SinisterIcy
 > Version ALPHA
 > Licensed under the GNU General Public License v3.0
 > Github: https://github.com/playeChess/PCE-TS
*/

namespace PlayeChessEngine {
    export class Move {
        private StartCoords: Array<number>;
        public get start_coords() : Array<number> {
            return this.StartCoords;
        }

        private EndCoords: Array<number>;
        public get end_coords() : Array<number> {
            return this.EndCoords;
        }

        private IsCapture: boolean;
        public set is_capture(is_capture: boolean) {
            this.IsCapture = is_capture;
        }
        public get is_capture() : boolean {
            return this.IsCapture;
        }

        private IsValid: boolean;
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

    namespace board {

        namespace pieces {

            export enum piece_type { p, r, n, b, q, k };

            export abstract class Piece {
                private Type: piece_type;
                public get type(): piece_type {
                    return this.Type;
                }
                protected set type(type: piece_type) {
                    this.Type = type;
                }

                private Coords: Array<number>;
                public get coords(): Array<number> {
                    return this.Coords;
                }
                public set coords(coords: Array<number>) {
                    this.Coords = coords;
                }

                private IsWhite: boolean;
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

                public abstract validation_function(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean;

                public validate_validation(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean {
                    if(board[x_final][y_final] == null) {
                        return true;
                    }
                    if(board[x_final][y_final].is_white != this.is_white) {
                        return true;
                    }
                    return false;
                }

                public check_path(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if(x_diff == 0) {
                        if(y_diff > 0) {
                            for(let i = 1; i < y_diff; i++) {
                                if(board[this.coords[0]][this.coords[1] + i] != null) {
                                    return false;
                                }
                            }
                        } else {
                            for(let i = 0; i < Math.abs(y_diff); i++) {
                                if(board[this.coords[0]][this.coords[1] - i] != null) {
                                    return false;
                                }
                            }
                        }
                    } else if(y_diff == 0) {
                        if(x_diff > 0) {
                            for(let i = 1; i < x_diff; i++) {
                                if(board[this.coords[0] + i][this.coords[1]] != null) {
                                    return false;
                                }
                            }
                        } else {
                            for(let i = 0; i < Math.abs(x_diff); i++) {
                                if(board[this.coords[0] - i][this.coords[1]] != null) {
                                    return false;
                                }
                            }
                        }
                    } else if(Math.abs(x_diff) == Math.abs(y_diff)) {
                        if(x_diff > 0 && y_diff > 0) {
                            for(let i = 1; i < x_diff; i++) {
                                if(board[this.coords[0] + i][this.coords[1] + i] != null) {
                                    return false;
                                }
                            }
                        } else if(x_diff > 0 && y_diff < 0) {
                            for(let i = 1; i < x_diff; i++) {
                                if(board[this.coords[0] + i][this.coords[1] - i] != null) {
                                    return false;
                                }
                            }
                        } else if(x_diff < 0 && y_diff > 0) {
                            for(let i = 0; i < Math.abs(x_diff); i++) {
                                if(board[this.coords[0] - i][this.coords[1] + i] != null) {
                                    return false;
                                }
                            }
                        } else if(x_diff < 0 && y_diff < 0) {
                            for(let i = 0; i < Math.abs(x_diff); i++) {
                                if(board[this.coords[0] - i][this.coords[1] - i] != null) {
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

            export class Pawn extends Piece {
                constructor(is_white: boolean, x: number, y: number) {
                    super(piece_type.p, is_white, x, y);
                }

                public validation_function(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if(y_diff == 0 && x_diff != 0) {
                        if(this.is_white) {
                            if(x_diff == 1) {
                                if(board[x_final][y_final] == null) {
                                    return true;
                                } 
                            } else if(x_diff == 2) {
                                if(!this.has_moved && board[x_final][y_final] == null) {
                                    return true;
                                }
                            }
                        } else {
                            if(x_diff == -1) {
                                if(board[x_final][y_final] == null) {
                                    return true;
                                } 
                            } else if(x_diff == -2) {
                                if(!this.has_moved && board[x_final][y_final] == null) {
                                    return true;
                                }
                            }
                        }
                    } else if(Math.abs(x_diff) == 1 && Math.abs(y_diff) == 1) {
                        if(this.is_white) {
                            if(x_diff == 1 && y_diff == 1) {
                                if(board[x_final][y_final] != null && !board[x_final][y_final].is_white) {
                                    return true;
                                }
                            } else if(x_diff == 1 && y_diff == -1) {
                                if(board[x_final][y_final] != null && !board[x_final][y_final].is_white) {
                                    return true;
                                }
                            }
                        } else {
                            if(x_diff == -1 && y_diff == 1) {
                                if(board[x_final][y_final] != null && board[x_final][y_final].is_white) {
                                    return true;
                                }
                            } else if(x_diff == -1 && y_diff == -1) {
                                if(board[x_final][y_final] != null && board[x_final][y_final].is_white) {
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

                validation_function(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean {
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

                public validation_function(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean {
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

                public validation_function(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean {
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

                public validation_function(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean {
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

                public validation_function(board: [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]], x_final: number, y_final: number): boolean {
                    let x_diff: number = x_final - this.coords[0];
                    let y_diff: number = y_final - this.coords[1];
                    if(Math.abs(x_diff) <= 1 && Math.abs(y_diff) <= 1) {
                        return this.validate_validation(board, x_final, y_final);
                    }
                    return false;
                }
            }
        } // namespace pieces

        export class Board {
            private Board: [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]];
            public set board(board: [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]]) {
                this.Board = board;
            }
            public get board(): [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]] {
                return this.Board;
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

            public print_board(moves: Array<Array<number>> =[], board: [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]] = this.Board): void {
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
                        if(board[7 - i][j] == null) {
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
                        if(this.Board[i][j] == null) continue;
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

            public get_all_moves(brd: [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]], white:boolean, from_premove:boolean=false): Array<Move> {
                let moves: Array<Move> = [];
                for(let i = 0; i < 8; i++) {
                    for(let j = 0; j < 8; j++) {
                        if(brd[i][j] == null) continue;
                        if(brd[i][j].is_white != white) continue;
                        let tmp_moves: Array<Move> = this.get_moves(i, j, from_premove);
                        for(let k = 0; k < tmp_moves.length; k++) {
                            moves.push(tmp_moves[k]);
                        }
                    }
                }
                return moves;
            }

            public get_all_landing_moves(brd: [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]], white:boolean, from_premove:boolean=false): Array<Array<number>> {
                let moves: Array<Array<number>> = [];
                for(let i = 0; i < 8; i++) {
                    for(let j = 0; j < 8; j++) {
                        if(brd[i][j] == null) continue;
                        if(brd[i][j].is_white != white) continue;
                        let tmp_moves: Array<Move> = this.get_moves(i, j, from_premove);
                        for(let k = 0; k < tmp_moves.length; k++) {
                            moves.push([tmp_moves[k].end_coords[0], tmp_moves[k].end_coords[1]]);
                        }
                    }
                }
                return moves;
            }

            public is_check(white:boolean): boolean {
                let moves = this.get_all_landing_moves(this.board, !white, true);
                for(let i = 0; i < moves.length; i++) {
                    if(this.board[moves[i][0]][moves[i][1]].type == 5)
                        return true;
                }
                return false;
            }

            public transfer_piece(start_coords: Array<number>, end_coords: Array<number>): void {
                let tmp = this.board[start_coords[0]][start_coords[1]];
                this.board[start_coords[0]][start_coords[1]] = this.board[end_coords[0]][end_coords[1]];
                this.board[end_coords[0]][end_coords[1]] = tmp;
                this.board[start_coords[0]][start_coords[1]].coords = start_coords;
                this.board[end_coords[0]][end_coords[1]].coords = end_coords;
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
                if(this.board[move.start_coords[0]][move.start_coords[1]] == null) {
                    move.is_valid = false;
                    return move;
                } if(this.board[move.start_coords[0]][move.start_coords[1]].is_white != white) {
                    move.is_valid = false;
                    return move;
                } if(this.get_moves(move.start_coords[0], move.start_coords[1]).includes(move)) {
                    move.is_capture = this.board[move.end_coords[0]][move.end_coords[1]] != null;
                    this.transfer_piece(move.start_coords, move.end_coords);
                    move.is_valid = true;
                }
                let start_ep_coords = this.get_en_passant(this.moves, white);
                if(start_ep_coords == [move.start_coords[0], move.start_coords[1]]) {
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

            // TODO : Insufficient material
        }
    } // namespace board
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