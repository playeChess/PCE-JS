/*
 > PCE-JS - Web Implementation of PlayeChessEngine (PCE)
 > Code by SinisterIcy
 > Version ALPHA
 > Licensed under the GNU General Public License v3.0
 > Github: https://github.com/playeChess/PCE-JS
*/

/**
 * Namespace for PlayeChessEngine
 */
var PlayeChessEngine = {
	Move: class Move {},
	/**
	 * Namespace of PlayeChessEngine for board
	 */
	board: {
		/**
		 * Namespace of PlayeChessEngine for pieces
		 */
		pieces: {
			piece_type: {},
			Piece: class Piece {},
			Pawn: class Pawn {},
			Rook: class Rook {},
			Knight: class Knight {},
			Bishop: class Bishop {},
			Queen: class Queen {},
			King: class King {}
		},
		Board: class Board {}
	},
	status: {},
	draw: {},
	win: {},
	PCE: class PCE {}
}

/**
 * A move (with start and end coordinates)
 */
PlayeChessEngine.Move = class Move {
	StartCoords
	/**
	 * Start coords of the move
	 * @type {[number, number]}
	 */
	get start_coords() {
		return this.StartCoords
	}
	/**
	 * End coords of the move
	 * @type {[number, number]}
	 */
	EndCoords
	get end_coords() {
		return this.EndCoords
	}
	IsCapture = false
	/**
	 * If the move is a capture
	 * @type {boolean}
	 */
	set is_capture(is_capture) {
		this.IsCapture = is_capture
	}
	get is_capture() {
		return this.IsCapture
	}
	IsValid = false
	/**
	 * If the move is valid
	 * @type {boolean}
	 */
	set is_valid(is_valid) {
		this.IsValid = is_valid
	}
	get is_valid() {
		return this.IsValid
	}
	constructor(start_square_x, start_square_y, end_square_x, end_square_y) {
		this.StartCoords = [start_square_x, start_square_y]
		this.EndCoords = [end_square_x, end_square_y]
	}
	/**
	 * Get a string who contains details about the move
	 * @returns {string} The details string
	 */
	show() {
		let files = "abcdefgh"
		return files[this.start_coords[0]] + (this.start_coords[1] + 1) + " -> " + files[this.end_coords[0]] + (this.end_coords[1] + 1)
	}
	/**
	 * Checks if the move is included in an array of moves
	 * @param {PlayeChessEngine.Move[]} moves The array of moves
	 * @returns {bool} Whether or not the move is included
	 */
	included_in(moves) {
		let included = false
		moves.forEach(mv => {
			mv.is_valid = false
			if(JSON.stringify(mv) == JSON.stringify(this)) {
				included = true
			}
		})
		return included
	}
}

PlayeChessEngine.board.pieces.piece_type = {
	no: -1,
	p: 0,
	r: 1,
	n: 2,
	b: 3,
	q: 4,
	k: 5
}

/**
 * A piece (with type, coords and color)
 */
PlayeChessEngine.board.pieces.Piece = class Piece {
	Type
	/**
	 * The type of the piece (-1,no -> no piece, 0,p -> pawn, 1,r -> rook, 2,n -> knight, 3,b -> bishop, 4,q -> queen, 5,k -> king)
	 * @type {PlayeChessEngine.board.pieces.piece_type}
	 */
	get type() {
		return this.Type
	}
	set type(type) {
		this.Type = type
	}
	Coords
	/**
	 * The coordinates of the piece
	 * @type {[number, number]}
	 */
	get coords() {
		return this.Coords
	}
	set coords(coords) {
		this.Coords = coords
	}
	IsWhite
	/**
	 * Whether or not the piece is white
	 * @type {boolean}
	 */
	set is_white(is_white) {
		this.IsWhite = is_white
	}
	get is_white() {
		return this.IsWhite
	}
	HasMoved
	/**
	 * Whether or not the piece has moved yet
	 * @type {boolean}
	 */
	set has_moved(has_moved) {
		this.HasMoved = has_moved
	}
	get has_moved() {
		return this.HasMoved
	}
	constructor(type, is_white, x, y) {
		this.type = type
		this.is_white = is_white
		this.coords = [x, y]
		this.has_moved = false
	}
	/**
	 * Validates the basic rules of the move (can not go where there is one of your pieces)
	 * @param {PlayeChessEngine.board.pieces.Piece[][]} board The board to check on
	 * @param {number} x_final The final x coordinate
	 * @param {number} y_final The final y coordinate
	 * @returns {boolean} Whether or not the move is legal
	 */
	validate_validation(board, x_final, y_final) {
		if (board[x_final][y_final].type == PlayeChessEngine.board.pieces.piece_type.no) {
			return true
		}
		if (board[x_final][y_final].is_white != this.is_white) {
			return true
		}
		return false
	}
	/**
	 * Checks if the path from a cell to another is clear
	 * @param {PlayeChessEngine.board.pieces.Piece[][]} board The board to check on
	 * @param {number} x_final The final x coordinate
	 * @param {number} y_final The final y coordinate
	 * @returns {boolean} Whether or not the move is legal
	 */
	check_path(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if (x_diff == 0) {
			if (y_diff > 0) {
				for (let i = 1; i < y_diff; i++) {
					if (board[this.coords[0]][this.coords[1] + i].type != PlayeChessEngine.board.pieces.piece_type.no) {
						return false
					}
				}
			}
			else {
				for (let i = 0; i < Math.abs(y_diff); i++) {
					if (board[this.coords[0]][this.coords[1] - i].type != PlayeChessEngine.board.pieces.piece_type.no) {
						return false
					}
				}
			}
		}
		else if (y_diff == 0) {
			if (x_diff > 0) {
				for (let i = 1; i < x_diff; i++) {
					if (board[this.coords[0] + i][this.coords[1]].type != PlayeChessEngine.board.pieces.piece_type.no) {
						return false
					}
				}
			}
			else {
				for (let i = 0; i < Math.abs(x_diff); i++) {
					if (board[this.coords[0] - i][this.coords[1]].type != PlayeChessEngine.board.pieces.piece_type.no) {
						return false
					}
				}
			}
		}
		else if (Math.abs(x_diff) == Math.abs(y_diff)) {
			if (x_diff > 0 && y_diff > 0) {
				for (let i = 1; i < x_diff; i++) {
					if (board[this.coords[0] + i][this.coords[1] + i].type != PlayeChessEngine.board.pieces.piece_type.no) {
						return false
					}
				}
			}
			else if (x_diff > 0 && y_diff < 0) {
				for (let i = 1; i < x_diff; i++) {
					if (board[this.coords[0] + i][this.coords[1] - i].type != PlayeChessEngine.board.pieces.piece_type.no) {
						return false
					}
				}
			}
			else if (x_diff < 0 && y_diff > 0) {
				for (let i = 0; i < Math.abs(x_diff); i++) {
					if (board[this.coords[0] - i][this.coords[1] + i].type != PlayeChessEngine.board.pieces.piece_type.no) {
						return false
					}
				}
			}
			else if (x_diff < 0 && y_diff < 0) {
				for (let i = 0; i < Math.abs(x_diff); i++) {
					if (board[this.coords[0] - i][this.coords[1] - i].type != PlayeChessEngine.board.pieces.piece_type.no) {
						return false
					}
				}
			}
		}
		return true
	}
	/**
	 * Get a string who contains details about the Piece
	 * @returns {string} The details string
	 */
	show() {
		if (this.is_white) {
			let piece_names = ["P", "R", "N", "B", "Q", "K"]
			return piece_names[this.type]
		}
		let piece_names = ["p", "r", "n", "b", "q", "k"]
		return piece_names[this.type]
	}
	/**
	 * Checks if a move is the same as another
	 * @param {Move} other The other move 
	 * @returns {boolean} Whether or not the moves are eqal
	 */
	compare(other) {
		if (this.type == other.type && this.is_white == other.is_white && this.coords[0] == other.coords[0] && this.coords[1] == other.coords[1]) {
			return true
		}
		return false
	}
}

/**
 * The Pawn class
 * @extends PlayeChessEngine.board.pieces.Piece
 */
PlayeChessEngine.board.pieces.Pawn = class Pawn extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.p, is_white, x, y)
	}
	/**
	 * The validation function for the Pawn
	 * @param {PlayeChessEngine.board.pieces.Piece[][]} board The board to check on 
	 * @param {number} x_final The final x coordinate
	 * @param {number} y_final The final y coordinate
	 * @returns {boolean} Whether or not the move is legal
	 */
	validation_function(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if (y_diff == 0 && x_diff != 0) {
			if (this.is_white) {
				if (x_diff == 1) {
					if (board[x_final][y_final].type == PlayeChessEngine.board.pieces.piece_type.no) {
						return true
					}
				}
				else if (x_diff == 2) {
					if (!this.has_moved && board[x_final][y_final].type == PlayeChessEngine.board.pieces.piece_type.no) {
						return true
					}
				}
			}
			else {
				if (x_diff == -1) {
					if (board[x_final][y_final].type == PlayeChessEngine.board.pieces.piece_type.no) {
						return true
					}
				}
				else if (x_diff == -2) {
					if (!this.has_moved && board[x_final][y_final].type == PlayeChessEngine.board.pieces.piece_type.no) {
						return true
					}
				}
			}
		}
		else if (Math.abs(x_diff) == 1 && Math.abs(y_diff) == 1) {
			if (this.is_white) {
				if (x_diff == 1 && y_diff == 1) {
					if (board[x_final][y_final].type != PlayeChessEngine.board.pieces.piece_type.no && !board[x_final][y_final].is_white) {
						return true
					}
				}
				else if (x_diff == 1 && y_diff == -1) {
					if (board[x_final][y_final].type != PlayeChessEngine.board.pieces.piece_type.no && !board[x_final][y_final].is_white) {
						return true
					}
				}
			}
			else {
				if (x_diff == -1 && y_diff == 1) {
					if (board[x_final][y_final].type != PlayeChessEngine.board.pieces.piece_type.no && board[x_final][y_final].is_white) {
						return true
					}
				}
				else if (x_diff == -1 && y_diff == -1) {
					if (board[x_final][y_final].type != PlayeChessEngine.board.pieces.piece_type.no && board[x_final][y_final].is_white) {
						return true
					}
				}
			}
		}
		return false
	}
}

/**
 * The Bishop class
 * @extends PlayeChessEngine.board.pieces.Piece
 */
PlayeChessEngine.board.pieces.Rook = class Rook extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.r, is_white, x, y)
	}
	/**
	 * The validation function for the Rook
	 * @param {PlayeChessEngine.board.pieces.Piece[][]} board The board to check on
	 * @param {number} x_final The final x coordinate
	 * @param {number} y_final The final y coordinate
	 * @returns {boolean} Whether or not the move is legal
	 */
	validation_function(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if (x_diff * y_diff == 0 && x_diff != y_diff) {
			if (this.validate_validation(board, x_final, y_final)) {
				return this.check_path(board, x_final, y_final)
			}
		}
		return false
	}
}

/**
 * The Knight class
 * @extends PlayeChessEngine.board.pieces.Piece
 */
PlayeChessEngine.board.pieces.Knight = class Knight extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.n, is_white, x, y)
	}
	/**
	 * The validation function for the Knight
	 * @param {PlayeChessEngine.board.pieces.Piece[][]} board The board to check on
	 * @param {number} x_final The final x coordinate
	 * @param {number} y_final The final y coordinate
	 * @returns {boolean} Whether or not the move is legal
	 */
	validation_function(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if ((Math.abs(x_diff) == 2 && Math.abs(y_diff) == 1) || (Math.abs(x_diff) == 1 && Math.abs(y_diff) == 2)) {
			return this.validate_validation(board, x_final, y_final)
		}
		return false
	}
}

/**
 * The Bishop class
 * @extends PlayeChessEngine.board.pieces.Piece
 */
PlayeChessEngine.board.pieces.Bishop = class Bishop extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.b, is_white, x, y)
	}
	/**
	 * The validation function for the Bishop
	 * @param {PlayeChessEngine.board.pieces.Piece[][]} board The board to check on
	 * @param {number} x_final The final x coordinate
	 * @param {number} y_final The final y coordinate
	 * @returns {boolean} Whether or not the move is legal
	 */
	validation_function(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if (Math.abs(x_diff) == Math.abs(y_diff) && x_diff != 0) {
			if (this.validate_validation(board, x_final, y_final)) {
				return this.check_path(board, x_final, y_final)
			}
		}
		return false
	}
}

/**
 * The Queen class
 * @extends PlayeChessEngine.board.pieces.Piece
 */
PlayeChessEngine.board.pieces.Queen = class Queen extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.q, is_white, x, y)
	}
	/**
	 * The validation function for the Queen
	 * @param {PlayeChessEngine.board.pieces.Piece[][]} board The board to check on
	 * @param {number} x_final The final x coordinate
	 * @param {number} y_final The final y coordinate
	 * @returns {boolean} Whether or not the move is legal
	 */
	validation_function(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if ((Math.abs(x_diff) == Math.abs(y_diff) && x_diff != 0) || (x_diff * y_diff == 0 && x_diff != y_diff)) {
			if (this.validate_validation(board, x_final, y_final)) {
				return this.check_path(board, x_final, y_final)
			}
		}
		return false
	}
}

/**
 * The King class
 * @extends PlayeChessEngine.board.pieces.Piece
 */
PlayeChessEngine.board.pieces.King = class King extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.k, is_white, x, y)
	}
	/**
	 * The validation function for the King
	 * @param {PlayeChessEngine.board.pieces.Piece[][]} board The board to check on
	 * @param {number} x_final The final x coordinate
	 * @param {number} y_final The final y coordinate
	 * @returns {boolean} Whether or not the move is legal
	 */
	validation_function(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if (Math.abs(x_diff) <= 1 && Math.abs(y_diff) <= 1) {
			return this.validate_validation(board, x_final, y_final)
		}
		return false
	}
}

/**
 * The Board class
 */
PlayeChessEngine.board.Board = class Board {
	Board = [
		[new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)],
		[new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)],
		[new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)],
		[new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)],
		[new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)],
		[new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)],
		[new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)],
		[new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1), new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)],
	]
	/**
	 * The board of the game
	 * @type {PlayeChessEngine.board.pieces.Piece[][]}
	 */
	set board(board) {
		this.Board = board
	}
	get board() {
		return this.Board
	}
	Boards = []
	/**
	 * The list of boards the game has been through
	 * @type {PlayeChessEngine.board.pieces.Piece[][][]}
	 */
	set boards(boards) {
		this.Boards = boards
	}
	get boards() {
		return this.Boards
	}
	Moves = []
	/**
	 * The list of moves the game has been through
	 * @type {PlayeChessEngine.Move[]}
	 */
	set moves(moves) {
		this.Moves = moves
	}
	get moves() {
		return this.Moves
	}
	WhiteTurn = true
	/**
	 * If it is white's turn
	 * @type {boolean}
	 * @default true
	 */
	set white_turn(whiteTurn) {
		this.WhiteTurn = whiteTurn
	}
	get white_turn() {
		return this.WhiteTurn
	}
	constructor(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
		let fen_array = fen.split(" ")
		fen = fen_array[0]
		this.white_turn = fen_array[1] == "w"
		this.load_fen(fen)
		console.log(this.board)
	}
	/**
	 * Compare the board to another board
	 * @param {PlayeChessEngine.board.Board} other 
	 * @returns {boolean} If the boards are the same
	 */
	compare(other) {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (!this.Board[i][j].compare(other.Board[i][j])) {
					return false
				}
			}
		}
		if (this.white_turn != other.white_turn) {
			return false
		}
		// come bak here
		return true
	}
	/**
	 * Reverses the fen string
	 * @param {string} fen 
	 * @returns {string} The reversed fen string
	 */
	reverse_fen(fen) {
		let fen_array = fen.split("/")
		let new_fen = ""
		for (let i = fen_array.length - 1; i >= 0; i--) {
			new_fen += [...fen_array[i]].reverse().join('') + "/"
		}
		return new_fen
	}
	/**
	 * Loads a fen string into the board (fills the board with pieces)
	 * @param {string} fen The fen string
	 */
	load_fen(fen) {
		fen = this.reverse_fen(fen)
		let fen_arr = [...fen]
		let x = 0
		let y = 0
		fen_arr.forEach(c => {
			if (c == "/") {
				y = 0
				x++
			}
			else if (c == "8")
				return
			else if (c >= "1" && c <= "8") {
				y += c.charCodeAt(0) - "0".charCodeAt(0)
			}
			else {
				let is_white = c >= "A" && c <= "Z"
				switch (c) {
					case "P":
					case "p":
						this.Board[x][y] = new PlayeChessEngine.board.pieces.Pawn(is_white, x, y)
						break
					case "R":
					case "r":
						this.Board[x][y] = new PlayeChessEngine.board.pieces.Rook(is_white, x, y)
						break
					case "N":
					case "n":
						this.Board[x][y] = new PlayeChessEngine.board.pieces.Knight(is_white, x, y)
						break
					case "B":
					case "b":
						this.Board[x][y] = new PlayeChessEngine.board.pieces.Bishop(is_white, x, y)
						break
					case "Q":
					case "q":
						this.Board[x][y] = new PlayeChessEngine.board.pieces.Queen(is_white, x, y)
						break
					case "K":
					case "k":
						this.Board[x][y] = new PlayeChessEngine.board.pieces.King(is_white, x, y)
						break
				}
				y++
			}
		})
	}
	/**
	 * Prints the board
	 * @param {PlayeChessEngine.Move[]} [moves=[]] The list of moves to highlight 
	 * @param {PlayeChessEngine.board.Board} [board=this.board] The board to print
	 */
	print_board(moves = [], board = this.Board) {
		let board_str = ""
		board_str += "  #-----------------#\n"
		for (let i = 0; i < 8; i++) {
			board_str += (8 - i) + " | ";
			for (let j = 0; j < 8; j++) {
				let skip = false
				for (let k = 0; k < moves.length; k++) {
					if (moves[k][0] == 7 - i && moves[k][1] == j) {
						board_str += "* "
						skip = true
						break
					}
				}
				if (skip)
					continue
				if (board[7 - i][j].type == PlayeChessEngine.board.pieces.piece_type.no) {
					board_str += "  "
				}
				else {
					board_str += board[7 - i][j].show() + " "
				}
			}
			board_str += "|\n"
		}
		board_str += "  #-----------------#\n"
		board_str += "    a b c d e f g h\n"
		console.log(board_str)
	}
	/**
	 * Gets all the moves for a given pice
	 * @param {number} x The x coordinate of the piece
	 * @param {number} y The y coordinate of the piece
	 * @param {boolean} [from_premove=false] If the function is called from a premove (used to prevent infinite recursion)
	 * @returns {PlayeChessEngine.Move[]} The list of moves
	 */
	get_moves(x, y, from_premove = false) {
		if(this.board[x][y].type == PlayeChessEngine.board.pieces.piece_type.no) {
			return []
		}
		let moves = []
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				console.log("Validating " + x + " " + y + " to " + JSON.stringify(this.board[i][j]))
				if(this.board[x][y].type == PlayeChessEngine.board.pieces.piece_type.no)
					continue
				if (this.board[x][y].validation_function(this.board, i, j)) {
					let move = new PlayeChessEngine.Move(x, y, i, j)
					if (from_premove) {
						move.is_valid = true
						moves.push(move)
					}
					else if (!this.premove_check(move, this.board[x][y].is_white)) {
						move.is_valid = true
						moves.push(move)
					}
				}
			}
		}
		return moves
	}
	/**
	 * Gets all the moves for a given player
	 * @param {PlayeChessEngine.board.pieces.Piece[]} brd The board to check on
	 * @param {boolean} white If the player is white
	 * @param {boolean} [from_premove=false] If the function is called from a premove (used to prevent infinite recursion)
	 * @returns {PlayeChessEngine.Move[]} The list of moves
	 */
	get_all_moves(brd, white, from_premove = false) {
		let moves = []
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (brd[i][j].type == PlayeChessEngine.board.pieces.piece_type.no)
					continue
				if (brd[i][j].is_white != white)
					continue
				let tmp_moves = this.get_moves(i, j, from_premove)
				for (let k = 0; k < tmp_moves.length; k++) {
					moves.push(tmp_moves[k])
				}
			}
		}
		return moves
	}
	/**
	 * Gets all landing cells for a player
	 * @param {boolean} white If the player is white 
	 * @param {boolean} [from_premove=false] If the function is called from a premove (used to prevent infinite recursion)
	 * @returns {[number, number][]} The end coordinates of every single move for the player
	 */
	get_all_landing_moves(white, from_premove = false) {
		let moves = []
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (this.board[i][j].type == PlayeChessEngine.board.pieces.piece_type.no)
					continue
				if (this.board[i][j].is_white != white)
					continue
				let tmp_moves = this.get_moves(i, j, from_premove)
				for (let k = 0; k < tmp_moves.length; k++) {
					moves.push([tmp_moves[k].end_coords[0], tmp_moves[k].end_coords[1]])
				}
			}
		}
		return moves
	}
	/**
	 * Checks if a player is in check
	 * @param {boolean} white If the player is white
	 * @returns {boolean} If the player is in check
	 */
	is_check(white) {
		let moves = this.get_all_landing_moves(!white, true)
		for (let i = 0; i < moves.length; i++) {
			if (this.board[moves[i][0]][moves[i][1]].type == 5)
				return true
		}
		return false
	}
	get_adapted_copy(piece) {
		if(piece instanceof PlayeChessEngine.board.pieces.Pawn) {
			return Object.assign(new PlayeChessEngine.board.pieces.Pawn, piece)
		}
		if(piece instanceof PlayeChessEngine.board.pieces.Rook) {
			return Object.assign(new PlayeChessEngine.board.pieces.Rook, piece)
		}
		if(piece instanceof PlayeChessEngine.board.pieces.Knight) {
			return Object.assign(new PlayeChessEngine.board.pieces.Knight, piece)
		}
		if(piece instanceof PlayeChessEngine.board.pieces.Bishop) {
			return Object.assign(new PlayeChessEngine.board.pieces.Bishop, piece)
		}
		if(piece instanceof PlayeChessEngine.board.pieces.Queen) {
			return Object.assign(new PlayeChessEngine.board.pieces.Queen, piece)
		}
		if(piece instanceof PlayeChessEngine.board.pieces.King) {
			return Object.assign(new PlayeChessEngine.board.pieces.King, piece)
		}
		return Object.assign(new PlayeChessEngine.board.pieces.Piece, piece)
	}
	/**
	 * Transfers a piece from start_coords to end_coords
	 * @param {[number, number]} start_coords The start coords 
	 * @param {*} end_coords 
	 */
	transfer_piece(start_coords, end_coords) {
		this.board[end_coords[0]][end_coords[1]] = this.get_adapted_copy(this.board[start_coords[0]][start_coords[1]])
		this.board[start_coords[0]][start_coords[1]] = new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)
		this.board[start_coords[0]][start_coords[1]].coords = start_coords
		this.board[end_coords[0]][end_coords[1]].coords = end_coords
	}
	/**
	 * Copies a board to another (to avoid references)
	 * @param {Piece[][]} board The board to copy
	 * @returns {Piece[][]} The board to copy to
	 */
	copy_board(board) {
		let tmp = [[...Array(8)], [...Array(8)], [...Array(8)], [...Array(8)], [...Array(8)], [...Array(8)], [...Array(8)], [...Array(8)]]
		for(let i = 0; i < 8; i++) {
			for(let j = 0; j < 8; j++) {
				tmp[i][j] = this.get_adapted_copy(board[i][j])
			}
		}
		return tmp
	}
	/**
	 * Copies the board of the given Board object to another
	 * @param {Board} board The board to copy
	 * @returns {Piece[][]} The board to copy to
	 */
	disref_board(board) {
		return this.copy_board(board.board)
	}
	/**
	 * Copies the board of a given Board object ot another
	 * @param {PlayeChessEngine.board.Board} board The board to copy
	 * @returns {PlayeChessEngine.board.Board} The board to copy to 
	 */
	copy(board) {
		let tmp = new PlayeChessEngine.board.Board()
		tmp.board = this.copy_board(board.board)
		tmp.boards = [...Array(board.boards.length)]
		for(let i = 0; i < board.boards.length; i++) {
			tmp.boards[i] = this.copy_board(board.boards[i])
		}
		tmp.moves = [...Array(board.moves.length)]
		for(let i = 0; i < board.moves.length; i++) {
			tmp.moves[i] = Object.assign(new PlayeChessEngine.Move(), board.moves[i])
		}
		tmp.white_turn = board.white_turn
		return tmp
	}
	/**
	 * Checks if a move puts the player who plays it in check
	 * @param {PlayeChessEngine.Move} move The move to check 
	 * @param {bool} white Whether or not the player is white 
	 * @returns {bool} If the move puts the player in check
	 */
	premove_check(move, white) {
		let tmp_board = this.copy(this)
		this.transfer_piece(move.start_coords, move.end_coords)
		let is_check = this.is_check(white)
		this.board = this.copy_board(tmp_board.board)
		return is_check
	}
	/**
	 * Gets the status of the game
	 * @param {bool} white If we want to check the status of white 
	 * @returns {number} The status number (0 -> game ongoing, 1 -> checkmate, 2 -> stalemate)
	 */
	status(white) {
		if (this.get_all_moves(this.board, white).length == 0) {
			if (this.is_check(white))
				return 1
			else
				return 2
		}
		return 0
	}
	/**
	 * Checks if the game is in insufficient material situation
	 * @returns {bool} Whether or not it actually is insufficient material
	 */
	insufficient_material() {
		let num_knights = 0
		let num_bishops = 0
		this.board.forEach(row => {
			row.forEach(piece => {
				if (piece.type == PlayeChessEngine.board.pieces.piece_type.no)
					return
				switch (piece.type) {
					case PlayeChessEngine.board.pieces.piece_type.p:
					case PlayeChessEngine.board.pieces.piece_type.r:
					case PlayeChessEngine.board.pieces.piece_type.q:
						return false
					case PlayeChessEngine.board.pieces.piece_type.n:
						num_knights++
						break
					case PlayeChessEngine.board.pieces.piece_type.b:
						num_bishops++
						break
					default: break
				}
				return
			})
		})
		if (num_knights == 0 && num_bishops == 0)
			return true
		return false
	}
	/**
	 * Checks if a player can castle
	 * @param {bool} white Whether or not the player is white
	 * @param {bool} kingside If you want to check kingside castling or not
	 * @returns {bool} If the player can actually castle on the given side
	 */
	can_castle(white, kingside) {
		let row = white ? 7 : 0
		let king = this.board[row][4]
		if (king.type == PlayeChessEngine.board.pieces.piece_type.no)
			return false
		if (king.has_moved)
			return false
		let rook = this.board[row][kingside ? 7 : 0]
		if (rook.type == PlayeChessEngine.board.pieces.piece_type.no)
			return false
		if (rook.has_moved)
			return false
		let start = kingside ? 5 : 1
		let end = kingside ? 7 : 3
		for (let i = start; i < end; i++) {
			if (this.board[row][i].type != PlayeChessEngine.board.pieces.piece_type.no || this.get_all_landing_moves(!white).includes([row, i])) {
				return false
			}
		}
		return true
	}
	/**
	 * Castles a player
	 * @param {bool} white Whether or not the player is white
	 * @param {bool} kingside If you want to castle kingside or not
	 */
	castle(white, kingside) {
		let row = white ? 7 : 0
		let king = this.board[row][4]
		let rook = this.board[row][kingside ? 7 : 0]
		this.transfer_piece([row, 4], [row, kingside ? 6 : 2])
		this.transfer_piece([row, kingside ? 7 : 0], [row, kingside ? 5 : 3])
	}
	/**
	 * Gets the coordinate of promotion for a player
	 * @param {bool} white Whether or not the player is white
	 * @returns {[number, number]} The coordinates of promotion (or [-1, -1] if the player cannot promote)
	 */
	get_promotion(white) {
		let row = white ? 0 : 7
		for (let i = 0; i < 8; i++) {
			if (this.board[row][i].type != PlayeChessEngine.board.pieces.piece_type.no) {
				if (this.board[row][i].type == PlayeChessEngine.board.pieces.piece_type.p && this.board[row][i].is_white == white) {
					return [row, i]
				}
			}
		}
		return [-1, -1]
	}
	/**
	 * Promote a given player's piece to a given type
	 * @param {bool} white Whether or not the player is white 
	 * @param {PlayeChessEngine.board.pieces.piece_type} type The type of piece to promote
	 * @returns {bool} If the player could actually promote
	 */
	promote(white, type) {
		let [row, col] = this.get_promotion(white)
		if (row == -1 || col == -1) {
			return false
		}
		if (type == PlayeChessEngine.board.pieces.piece_type.r) {
			this.board[row][col] = new PlayeChessEngine.board.pieces.Rook(white, row, col)
		}
		else if (type == PlayeChessEngine.board.pieces.piece_type.n) {
			this.board[row][col] = new PlayeChessEngine.board.pieces.Knight(white, row, col)
		}
		else if (type == PlayeChessEngine.board.pieces.piece_type.b) {
			this.board[row][col] = new PlayeChessEngine.board.pieces.Bishop(white, row, col)
		}
		else if (type == PlayeChessEngine.board.pieces.piece_type.q) {
			this.board[row][col] = new PlayeChessEngine.board.pieces.Queen(white, row, col)
		}
		else {
			return false
		}
		return true
	}
	/**
	 * Checks if the game is in a threefold repetition situation
	 * @param {bool} white Whether or not it is white to play
	 * @returns {bool} If the game is actually in threefold repetition
	 */
	check_threefold_repetition(white) {
		let count = 1
		for (let i = 0; i < this.boards.length; i++) {
			if (this.compare(this.boards[i]) && ((i % 2 == 0) == white))
				count++
		}
		return count >= 3
	}
	/**
	 * Gets coordinates of en passant for a player on the given side of a pawn
	 * @param {bool} white Whether or not the player is white
	 * @param {number} side The horizontal offset from the pawn (-1 or 1)
	 * @returns {[number, number]} The coordinates of en passant (or [-1, -1] if the player cannot en passant)
	 */
	get_en_passant_side(white, side) {
		let last_move = this.moves[this.moves.length - 1]
		let offset = white ? -2 : 2
		if (last_move.end_coords[1] + side < 0 || last_move.end_coords[1] + side > 7)
			return [-1, -1]
		if (this.board[last_move.end_coords[0]][last_move.end_coords[1] + side].type != PlayeChessEngine.board.pieces.piece_type.no) {
			let ep_piece = this.board[last_move.end_coords[0]][last_move.end_coords[1] + side]
			if (ep_piece.type == PlayeChessEngine.board.pieces.piece_type.p && ep_piece.is_white == white)
				return [last_move.end_coords[0] + offset, last_move.end_coords[1] + side]
		}
		return [-1, -1]
	}
	/**
	 * Gets the coordinates of en passant for a given player
	 * @param {bool} white Whether or not the player is white
	 * @returns {[number, number]} The coordinates of en passant (or [-1, -1] if the player cannot en passant)
	 */
	get_en_passant(white) {
		if (this.moves.length == 0)
			return [-1, -1]
		let last_move = this.moves[this.moves.length - 1]
		let moved_piece = this.board[last_move.end_coords[0]][last_move.end_coords[1]]
		if (last_move.end_coords[0] == last_move.start_coords[0] + (white ? -2 : 2) && moved_piece.type == PlayeChessEngine.board.pieces.piece_type.p && moved_piece.is_white == white) {
			let nside = this.get_en_passant_side(white, -1)
			if (nside.toString() != [-1, -1].toString())
				return nside
			return this.get_en_passant_side(white, 1)
		}
		return [-1, -1]
	}
	/**
	 * Plays en passant from given coords to given coords
	 * @param {[number, number]} start_coords The start coords 
	 * @param {[number, number]} end_coords The end coords
	 * @param {bool} white Whether or not the player is white
	 */
	en_passant(start_coords, end_coords, white) {
		this.transfer_piece(start_coords, end_coords)
	}
	/**
	 * Make a move
	 * @param {PlayeChessEngine.Move} move The move to play 
	 * @returns {PlayeChessEngine.Move} The updated move
	 */
	move(move) {
		let white = this.board[move.start_coords[0]][move.start_coords[1]].is_white
		if (move.included_in(this.get_moves(move.start_coords[0], move.start_coords[1]))) {
			move.is_capture = this.board[move.end_coords[0]][move.end_coords[1]].type != PlayeChessEngine.board.pieces.piece_type.no
			this.transfer_piece(move.start_coords, move.end_coords)
			this.boards.push(this.disref_board(this))
			move.is_valid = true
			return move
		}
		let start_ep_coords = this.get_en_passant(white)
		if (start_ep_coords.toString() === [move.start_coords[0], move.start_coords[1]].toString()) {
			let side = this.moves[this.moves.length - 1].end_coords[0] - start_ep_coords[0]
			let offset = white ? 1 : -1
			if (move.end_coords[0] == start_ep_coords[0] + offset && move.end_coords[1] == start_ep_coords[1] + side) {
				this.en_passant(start_ep_coords, [start_ep_coords[0] + offset, start_ep_coords[1] + side], white)
				this.boards.push(this.disref_board(this))
				move.is_valid = true
				move.is_capture = true
				return move
			}
		}
		move.is_valid = false
		return move
	}
}

/**
 * The status of the game
 * 0 -> Game ongoing
 * 1 -> Draw
 * 2 -> Win
 */
PlayeChessEngine.status = {
	game_ongoing: 0,
	draw: 1,
	win: 2
}

/**
 * The draw id of a game
 * 0 -> Stalemate
 * 1 -> Insufficient material
 * 2 -> Fifty moves
 * 3 -> Threefold repetition
 */
PlayeChessEngine.draw = {
	stalemate: 0,
	insufficient_material: 1,
	fifty_moves: 2,
	threefold_repetition: 3
}

/**
 * The win id of a game
 * 0 -> White won
 * 1 -> Black won
 */
PlayeChessEngine.win = {
	white: 0,
	black: 1
}

/**
 * The PCE class of PlayeChessEngine (only accessible class)
 */
PlayeChessEngine.PCE = class PCE {
	/**
	 * The precedent moves
	 */
	moves = []
	/**
	 * The precedent boards
	 */
	boards = []
	/**
	 * The actual board
	 */
	board = new PlayeChessEngine.board.Board()
	/**
	 * The move countdown (for fifty moves)
	 */
	move_countdown = 50

	constructor() {
		this.board.print_board()
		this.boards.push(this.board)
	}

	/**
	 * Gets the status of the game
	 * @returns {[number, number]} The game id and detail id of the game
	 */
	status() {
		if (this.board.status(!white) == 1) {
			if (white) {
				return PlayeChessEngine.status.win, PlayeChessEngine.win.white
			}
			else {
				return PlayeChessEngine.status.win, PlayeChessEngine.win.black
			}
		}
		else if (this.board.status(!white) == 2) {
			return PlayeChessEngine.status.draw, PlayeChessEngine.draw.stalemate
		}
		else if (this.board.insufficient_material()) {
			return PlayeChessEngine.status.draw, PlayeChessEngine.draw.insufficient_material
		}
		else if (this.move_countdown == 0) {
			return PlayeChessEngine.status.draw, PlayeChessEngine.draw.fifty_moves
		}
		else if (this.board.check_threefold_repetition(white)) {
			return PlayeChessEngine.status.draw, PlayeChessEngine.draw.threefold_repetition
		}
		return PlayeChessEngine.status.game_ongoing
	}

	/**
	 * Gets all moves for a given piece
	 * @param {number} x The x coordinate of the piece
	 * @param {number} y The y coordinate of the piece
	 * @return {PlayeChessEngine.Move[]} All the possible moves
	 */
	get_moves(x, y) {
		return this.board.get_moves(x, y)
	}

	/**
	 * Move a piece from [x0, y0] to [x1, y1]
	 * @param {number} x0 The start x coordinate
	 * @param {number} y0 The start y coordinate
	 * @param {number} x1 The end x coordinate
	 * @param {number} y1 The end y coordinate
	 */
	move(x0, y0, x1, y1) {
		let mv = new PlayeChessEngine.Move(x0, y0, x1, y1)
		this.board.move(mv)
		this.boards.push(this.board)
		this.moves.push(mv)
		this.move_countdown--
	}
}
