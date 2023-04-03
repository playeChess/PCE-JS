/*
 > PCE-JS - Web Implementation of PlayeChessEngine (PCE)
 > Code by SinisterIcy
 > Version ALPHA
 > Licensed under the GNU General Public License v3.0
 > Github: https://github.com/playeChess/PCE-JS
*/

var PlayeChessEngine = {
	Move: class Move {},
	board: {
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
	PCE: class PCE {}
}

PlayeChessEngine.Move = class Move {
	StartCoords
	get start_coords() {
		return this.StartCoords
	}
	EndCoords
	get end_coords() {
		return this.EndCoords
	}
	IsCapture = false
	set is_capture(is_capture) {
		this.IsCapture = is_capture
	}
	get is_capture() {
		return this.IsCapture
	}
	IsValid = false
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
	show() {
		let files = "abcdefgh"
		return files[this.start_coords[0]] + (this.start_coords[1] + 1) + " -> " + files[this.end_coords[0]] + (this.end_coords[1] + 1)
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

PlayeChessEngine.board.pieces.Piece = class Piece {
	Type = PlayeChessEngine.board.pieces.piece_type.p
	get type() {
		return this.Type
	}
	set type(type) {
		this.Type = type
	}
	Coords = [-1, -1]
	get coords() {
		return this.Coords
	}
	set coords(coords) {
		this.Coords = coords
	}
	IsWhite = true
	set is_white(is_white) {
		this.IsWhite = is_white
	}
	get is_white() {
		return this.IsWhite
	}
	HasMoved = false
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
	}
	ChessBoard = [[Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece], [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]]
	validate_validation(board, x_final, y_final) {
		if (board[x_final][y_final].type == PlayeChessEngine.board.pieces.piece_type.no) {
			return true
		}
		if (board[x_final][y_final].is_white != this.is_white) {
			return true
		}
		return false
	}
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
	show() {
		if (this.is_white) {
			let piece_names = ["P", "N", "B", "R", "Q", "K"]
			return piece_names[this.type]
		}
		let piece_names = ["p", "n", "b", "r", "q", "k"]
		return piece_names[this.type]
	}
	compare(other) {
		if (this.type == other.type && this.is_white == other.is_white && this.coords[0] == other.coords[0] && this.coords[1] == other.coords[1]) {
			return true
		}
		return false
	}
}

PlayeChessEngine.board.pieces.Pawn = class Pawn extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.p, is_white, x, y)
	}
	validation_function(board, x_final, y_final) {
		console.log("Validating Pawn (" + this.coords[0] + ", " + this.coords[1] + ") to (" + x_final + ", " + y_final + ")");
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

PlayeChessEngine.board.pieces.Rook = class Rook extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.r, is_white, x, y)
	}
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

PlayeChessEngine.board.pieces.Knight = class Knight extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.n, is_white, x, y)
	}
	validation_function(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if ((Math.abs(x_diff) == 2 && Math.abs(y_diff) == 1) || (Math.abs(x_diff) == 1 && Math.abs(y_diff) == 2)) {
			return this.validate_validation(board, x_final, y_final)
		}
		return false
	}
}
PlayeChessEngine.board.pieces.Bishop = class Bishop extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.b, is_white, x, y)
	}
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
PlayeChessEngine.board.pieces.Queen = class Queen extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.q, is_white, x, y)
	}
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
},
PlayeChessEngine.board.pieces.King = class King extends PlayeChessEngine.board.pieces.Piece {
	constructor(is_white, x, y) {
		super(PlayeChessEngine.board.pieces.piece_type.k, is_white, x, y)
	}
	validation_function(board, x_final, y_final) {
		let x_diff = x_final - this.coords[0]
		let y_diff = y_final - this.coords[1]
		if (Math.abs(x_diff) <= 1 && Math.abs(y_diff) <= 1) {
			return this.validate_validation(board, x_final, y_final)
		}
		return false
	}
}
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
	set board(board) {
		this.Board = board
	}
	get board() {
		return this.Board
	}
	Boards = []
	set boards(boards) {
		this.Boards = boards
	}
	get boards() {
		return this.Boards
	}
	Moves = []
	set moves(moves) {
		this.Moves = moves
	}
	get moves() {
		return this.Moves
	}
	WhiteTurn = true
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
	}
	compare(other) {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (this.Board[i][j].compare(other.Board[i][j])) {
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
	reverse_fen(fen) {
		let fen_array = fen.split("/")
		let new_fen = ""
		for (let i = fen_array.length - 1; i >= 0; i--) {
			new_fen += [...fen_array[i]].reverse().join('') + "/"
		}
		return new_fen
	}
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
	get_moves(x, y, from_premove = false) {
		let moves = []
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				console.log("Checking " + i + j + " for " + x + y)
				console.log(this.board)
				console.log(this.board[x][y].constructor.name)
				if(this.board[x][y].type == PlayeChessEngine.board.pieces.piece_type.no)
					continue
				console.log(this.board[x][y])
				if (this.board[x][y].validation_function(this.board, i, j)) {
					console.log("Valid" + i + j + " for " + x + y)
					let move = new PlayeChessEngine.Move(i, j, x, y)
					if (from_premove) {
						moves.push(move)
						continue
					}
					if (!this.premove_check(move, this.board[x][y].is_white))
						moves.push(move)
				}
			}
		}
		return moves
	}
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
	is_check(white) {
		let moves = this.get_all_landing_moves(!white, true)
		for (let i = 0; i < moves.length; i++) {
			if (this.board[moves[i][0]][moves[i][1]].type == 5)
				return true
		}
		return false
	}
	transfer_piece(start_coords, end_coords) {
		this.board[end_coords[0]][end_coords[1]] = Object.assign(new PlayeChessEngine.board.pieces.Piece, this.board[start_coords[0]][start_coords[1]])
		this.board[start_coords[0]][start_coords[1]] = new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)
		this.board[start_coords[0]][start_coords[1]].coords = start_coords
		this.board[end_coords[0]][end_coords[1]].coords = end_coords
	}
	premove_check(move, white) {
		let tmp_board = Object.assign(new PlayeChessEngine.board.Board(), this.board)
		this.transfer_piece(move.start_coords, move.end_coords)
		let is_check = this.is_check(white)
		this.board = Object.assign(new PlayeChessEngine.board.Board(), tmp_board)
		return is_check
	}
	move(move, white) {
		if (this.board[move.start_coords[0]][move.start_coords[1]].type == PlayeChessEngine.board.pieces.piece_type.no) {
			move.is_valid = false
			console.log("No piece at start coords")
			return move
		}
		if (this.board[move.start_coords[0]][move.start_coords[1]].is_white != white) {
			move.is_valid = false
			console.log("Wrong color piece at start coords")
			return move
		}
		if (this.get_moves(move.start_coords[0], move.start_coords[1]).includes(move)) {
			move.is_capture = this.board[move.end_coords[0]][move.end_coords[1]].type != PlayeChessEngine.board.pieces.piece_type.no
			this.transfer_piece(move.start_coords, move.end_coords)
			console.log("Move is valid")
			move.is_valid = true
		}
		let start_ep_coords = this.get_en_passant(white)
		if (start_ep_coords.toString() === [move.start_coords[0], move.start_coords[1]].toString()) {
			let side = this.moves[this.moves.length - 1].end_coords[0] - start_ep_coords[0]
			let offset = white ? 1 : -1
			if (move.end_coords[0] == start_ep_coords[0] + offset && move.end_coords[1] == start_ep_coords[1] + side) {
				this.en_passant(start_ep_coords, [start_ep_coords[0] + offset, start_ep_coords[1] + side], white)
				move.is_valid = true
				move.is_capture = true
				console.log("Move is valid (en passant)")
				return move
			}
		}
		console.log("Move is invalid")
		move.is_valid = false
		return move
	}
	status(white) {
		if (this.get_all_moves(this.board, white).length == 0) {
			if (this.is_check(white))
				return 1
			else
				return 2
		}
		return 0
	}
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
			if (this.board[row][i].type != PlayeChessEngine.board.pieces.piece_type.no || this.get_all_landing_moves(!white).includes([row, i]))
				return false
		}
		return true
	}
	castle(white, kingside) {
		let row = white ? 7 : 0
		let king = this.board[row][4]
		let rook = this.board[row][kingside ? 7 : 0]
		this.transfer_piece([row, 4], [row, kingside ? 6 : 2])
		this.transfer_piece([row, kingside ? 7 : 0], [row, kingside ? 5 : 3])
	}
	get_promotion(white) {
		let row = white ? 0 : 7
		for (let i = 0; i < 8; i++) {
			if (this.board[row][i].type != PlayeChessEngine.board.pieces.piece_type.no) {
				if (this.board[row][i].type == PlayeChessEngine.board.pieces.piece_type.p && this.board[row][i].is_white == white)
					return [row, i]
			}
		}
		return [-1, -1]
	}
	promote(white, type) {
		let [row, col] = this.get_promotion(white)
		if (row == -1 || col == -1)
			return false
		if (type == PlayeChessEngine.board.pieces.piece_type.r)
			this.board[row][col] = new PlayeChessEngine.board.pieces.Rook(white, row, col)
		else if (type == PlayeChessEngine.board.pieces.piece_type.n)
			this.board[row][col] = new PlayeChessEngine.board.pieces.Knight(white, row, col)
		else if (type == PlayeChessEngine.board.pieces.piece_type.b)
			this.board[row][col] = new PlayeChessEngine.board.pieces.Bishop(white, row, col)
		else if (type == PlayeChessEngine.board.pieces.piece_type.q)
			this.board[row][col] = new PlayeChessEngine.board.pieces.Queen(white, row, col)
		return true
	}
	check_threefold_repetition(white) {
		let count = 1
		for (let i = 0; i < this.boards.length; i++) {
			if (this.compare(this.boards[i]) && ((i % 2 == 0) == white))
				count++
		}
		return count >= 3
	}
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
	en_passant(start_coords, end_coords, white) {
		this.transfer_piece(start_coords, end_coords)
	}
}

PlayeChessEngine.PCE = class PCE {
	moves = []
	boards = []
	board = new PlayeChessEngine.board.Board()
	move_countdown = 50
	single_move(move, white, auto_promote) {
		let valid = false
		if (move == 'exit')
			return true
		if (move == "O-O") {
			if (this.board.can_castle(white, true)) {
				this.board.castle(white, true)
				return false
			}
		}
		if (move == "O-O-O") {
			if (this.board.can_castle(white, false)) {
				this.board.castle(white, false)
				return false
			}
		}
		let move_obj = new PlayeChessEngine.Move(move.charCodeAt(1) - '1'.charCodeAt(0), move.charCodeAt(0) - 'a'.charCodeAt(0), move.charCodeAt(3) - '1'.charCodeAt(0), move.charCodeAt(2) - 'a'.charCodeAt(0))
		let type = this.board.board[move_obj.start_coords[0]][move_obj.start_coords[1]].type
		move_obj = this.board.move(move_obj, white)
		console.log(move_obj)
		valid = move_obj.is_valid
		if (valid) {
			this.moves.push(move_obj)
			this.boards.push(this.board)
		}
		if (!move_obj.is_capture || type == PlayeChessEngine.board.pieces.piece_type.p)
			this.move_countdown = 50
		else
			this.move_countdown--
		if (type == PlayeChessEngine.board.pieces.piece_type.p) {
			if (this.board.get_promotion(white).toString() != [-1, -1].toString()) {
				this.board.promote(white, auto_promote)
			}
		}
		return false
	}
	move(white) {
		console.clear()
		this.board.moves = this.moves
		this.board.boards = this.boards
		this.board.white_turn = white
		if (white)
			console.log("> White to play <")
		else
			console.log("> Black to play <")
		let color_moves = this.board.get_all_moves(this.board.board, white)
		for (let move of color_moves) {
			console.log(move.show())
		}
		this.board.print_board(this.board.get_all_landing_moves(white))
		let valid = false
		while (!valid) {
			//valid = this.single_move()
		}
		return false
	}
	constructor(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
		this.board = new PlayeChessEngine.board.Board(fen)
	}
	main() {
		let move_count = 0
		let break_loop = false
		this.boards.push(this.board)
		while (true) {
			let white = move_count % 2 == 0
			break_loop = false // this.move(white)
			if (break_loop)
				break
			if (this.board.status(!white) == 1) {
				console.clear()
				this.board.print_board()
				if (white)
					console.log("White wins (checkmate)")
				else
					console.log("Black wins (checkmate)")
				break
			}
			else if (this.board.status(!white) == 2) {
				console.clear()
				this.board.print_board()
				console.log("Draw (stalemate)")
				break
			}
			else if (this.board.insufficient_material()) {
				console.clear()
				this.board.print_board()
				console.log("Draw (insufficient material)")
				break
			}
			else if (this.move_countdown == 0) {
				console.clear()
				this.board.print_board()
				console.log("Draw (50 move rule)")
				break
			}
			else if (this.board.check_threefold_repetition(white)) {
				console.clear()
				this.board.print_board()
				console.log("Draw (threefold repetition)")
				break
			}
			move_count++
		}
		for (let i = 0; i < this.moves.length; i += 2) {
			if (i + 1 < this.moves.length)
				console.log(i / 2 + 1 + "... " + this.moves[i].show() + " " + this.moves[i + 1].show())
		}
	}
}

/**
 * User Functions
 *
 * class PCE:
 *
 * PCE.status() -> Gets the status of the game
 *	->
 *		status_id:int, -> The status id (0: game ongoing; 1: draw; 2: win)
 *		(detail_id:int) -> Only for status_id=1 (0: stalemate; 1: insufficient material; 2: 50 moves rule; 3: threefold repetition) and status_id=2 (0: white, 1: black)
 *
 * PCE.getMoves(white) -> Gets all possible moves for a player (white)
 * 	->
 * 		moves:array3d[int] -> All the possible moves as [[[move0_start_x, move0_start_y], [move0_end_x, move0_end_y]], [[move1_start_x, move1_start_y], [move1_end_x, move1_end_y]], ...]
 * 
 * PCE.move(start_pos:array[int], end_pos:array[int]) -> Moves a piece from start_pos to end_pos
 * 	->
 * 		None
 * 
 */
