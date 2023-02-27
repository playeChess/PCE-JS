/*
 > PCE-TS - Web Implementation of Play eChess Engine
 > Code by SinisterIcy
 > Version ALPHA
 > Licensed under the GNU General Public License v3.0
 > Github: https://github.com/playeChess/PCE-TS
*/

namespace PlayeChessEngine {
    class Move {
        private start_square_x: number;
        private start_square_y: number;
        private end_square_x: number;
        private end_square_y: number;
        private is_capture: boolean;
        private is_valid: boolean;

        constructor(start_square_x: number, start_square_y: number, end_square_x: number, end_square_y: number, is_capture: boolean, is_valid: boolean) {
            this.start_square_x = start_square_x;
            this.start_square_y = start_square_y;
            this.end_square_x = end_square_x;
            this.end_square_y = end_square_y;
            this.is_capture = is_capture;
            this.is_valid = is_valid;
        }

        public show() {
            let files = "abcdefgh";
            return files[this.start_square_x] + (this.start_square_y + 1) + " -> " + files[this.end_square_x] + (this.end_square_y + 1);
        }

        public get_start_coords() {
            return [this.start_square_x, this.start_square_y];
        }

        public get_end_coords() {
            return [this.end_square_x, this.end_square_y];
        }

        public set_capture(is_capture: boolean) {
            this.is_capture = is_capture;
        }

        public get_capture() {
            return this.is_capture;
        }

        public set_valid(is_valid: boolean) {
            this.is_valid = is_valid;
        }

        public get_valid() {
            return this.is_valid;
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