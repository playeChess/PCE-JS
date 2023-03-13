export declare namespace PlayeChessEngine {
    class Move {
        private StartCoords;
        get start_coords(): [number, number];
        private EndCoords;
        get end_coords(): [number, number];
        private IsCapture;
        set is_capture(is_capture: boolean);
        get is_capture(): boolean;
        private IsValid;
        set is_valid(is_valid: boolean);
        get is_valid(): boolean;
        constructor(start_square_x: number, start_square_y: number, end_square_x: number, end_square_y: number);
        show(): string;
    }
    namespace board {
        export namespace pieces {
            export enum piece_type {
                p = 0,
                r = 1,
                n = 2,
                b = 3,
                q = 4,
                k = 5
            }
            export abstract class Piece {
                private Type;
                get type(): piece_type;
                protected set type(type: piece_type);
                private Coords;
                get coords(): [number, number];
                set coords(coords: [number, number]);
                private IsWhite;
                set is_white(is_white: boolean);
                get is_white(): boolean;
                private HasMoved;
                set has_moved(has_moved: boolean);
                get has_moved(): boolean;
                constructor(type: piece_type, is_white: boolean, x: number, y: number);
                ChessBoard: (typeof Piece)[][];
                abstract validation_function(board: ChessBoard, x_final: number, y_final: number): boolean;
                validate_validation(board: ChessBoard, x_final: number, y_final: number): boolean;
                check_path(board: ChessBoard, x_final: number, y_final: number): boolean;
                show(): string;
                compare(other: Piece): boolean;
            }
            type ChessBoard = [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]];
            export class Pawn extends Piece {
                constructor(is_white: boolean, x: number, y: number);
                validation_function(board: ChessBoard, x_final: number, y_final: number): boolean;
            }
            export class Rook extends Piece {
                constructor(is_white: boolean, x: number, y: number);
                validation_function(board: ChessBoard, x_final: number, y_final: number): boolean;
            }
            export class Knight extends Piece {
                constructor(is_white: boolean, x: number, y: number);
                validation_function(board: ChessBoard, x_final: number, y_final: number): boolean;
            }
            export class Bishop extends Piece {
                constructor(is_white: boolean, x: number, y: number);
                validation_function(board: ChessBoard, x_final: number, y_final: number): boolean;
            }
            export class Queen extends Piece {
                constructor(is_white: boolean, x: number, y: number);
                validation_function(board: ChessBoard, x_final: number, y_final: number): boolean;
            }
            export class King extends Piece {
                constructor(is_white: boolean, x: number, y: number);
                validation_function(board: ChessBoard, x_final: number, y_final: number): boolean;
            }
            export {};
        }
        type ChessBoard = [[pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece], [pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece, pieces.Piece]];
        export class Board {
            private Board;
            set board(board: ChessBoard);
            get board(): ChessBoard;
            private Boards;
            set boards(boards: Array<Board>);
            get boards(): Array<Board>;
            private Moves;
            set moves(moves: Array<Move>);
            get moves(): Array<Move>;
            private WhiteTurn;
            set white_turn(whiteTurn: boolean);
            get white_turn(): boolean;
            constructor(fen?: string);
            compare(other: Board): boolean;
            reverse_fen(fen: string): string;
            load_fen(fen: string): void;
            print_board(moves?: Array<Array<number>>, board?: ChessBoard): void;
            get_moves(x: number, y: number, from_premove?: boolean): Array<Move>;
            get_all_moves(brd: ChessBoard, white: boolean, from_premove?: boolean): Array<Move>;
            get_all_landing_moves(white: boolean, from_premove?: boolean): Array<Array<number>>;
            is_check(white: boolean): boolean;
            transfer_piece(start_coords: [number, number], end_coords: [number, number]): void;
            premove_check(move: Move, white: boolean): boolean;
            move(move: Move, white: boolean): Move;
            status(white: boolean): number;
            insufficient_material(): boolean;
            can_castle(white: boolean, kingside: boolean): boolean;
            castle(white: boolean, kingside: boolean): void;
            get_promotion(white: boolean): [number, number];
            promote(white: boolean, type: pieces.piece_type): void;
            check_threefold_repetition(white: boolean): boolean;
            get_en_passant_side(white: boolean, side: number): [number, number];
            get_en_passant(white: boolean): [number, number];
            en_passant(start_coords: [number, number], end_coords: [number, number], white: boolean): void;
        }
        export {};
    }
    class PCE {
        private moves;
        private boards;
        private board;
        private move_countdown;
        move(white: boolean): Promise<boolean>;
        constructor(fen?: string);
        main(): Promise<void>;
    }
}
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
