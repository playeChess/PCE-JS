/*
 > PCE-TS - Web Implementation of Play eChess Engine
 > Code by SinisterIcy
 > Version ALPHA
 > Licensed under the GNU General Public License v3.0
 > Github: https://github.com/playeChess/PCE-TS
*/

namespace PlayeChessEngine {
    class Move {
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

        constructor(start_square_x: number, start_square_y: number, end_square_x: number, end_square_y: number, is_capture: boolean, is_valid: boolean) {
            this.StartCoords = [start_square_x, start_square_y];
            this.EndCoords = [end_square_x, end_square_y];
            this.is_capture = is_capture;
            this.is_valid = is_valid;
        }

        public show() : string {
            let files = "abcdefgh";
            return files[this.start_coords[0]] + (this.start_coords[1] + 1) + " -> " + files[this.end_coords[0]] + (this.end_coords[1] + 1);
        }
    }

    namespace board {

        namespace pieces {

            enum piece_type { p, r, n, b, q, k };

            abstract class Piece {
                private Type: piece_type;
                protected get type(): piece_type {
                    return this.Type;
                }
                protected set type(type: piece_type) {
                    this.Type = type;
                }

                private Coords: Array<number>;
                protected get coords(): Array<number> {
                    return this.Coords;
                }
                protected set coords(coords: Array<number>) {
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
            }

            class Pawn extends Piece {
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

            
        }
    }
}

/**
 * Fonctionnement
 * 
 * Classe PCE:
 * 
 * isDraw() -> [bool, (type: string)]
 * isLegal() -> [bool, (board: array 2D)]
 * isWon() -> bool, team: string
 * 
 * getMoves() -> array 2D
 * move(start_pos, end_pos)
 * 
 */