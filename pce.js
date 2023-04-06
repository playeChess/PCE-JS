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
	status: {},
	draw: {},
	win: {},
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
	included_in(moves) {
		moves.forEach(mv => {
			console.log(JSON.stringify(mv))
			console.log(JSON.stringify(this))
			if(JSON.stringify(mv) == JSON.stringify(this)) {
				return true
			}
		})
		return false
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
		console.log("update board")
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
		console.log(this.board)
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
		if(this.board[x][y].type == PlayeChessEngine.board.pieces.piece_type.no) {
			return []
		}
		console.log(this.board)
		console.trace()
		let moves = []
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				console.log("Checking " + x + y + " to " + i + j)
				console.log(this.board)
				console.log(this.board[x][y])
				if(this.board[x][y].type == PlayeChessEngine.board.pieces.piece_type.no)
					continue
				if (this.board[x][y].validation_function(this.board, i, j)) {
					console.log("Valid" + x + y + " to " + i + j)
					let move = new PlayeChessEngine.Move(x, y, i, j)
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
		console.log("transfer")
		this.board[end_coords[0]][end_coords[1]] = Object.assign(new PlayeChessEngine.board.pieces.Piece, this.board[start_coords[0]][start_coords[1]])
		this.board[start_coords[0]][start_coords[1]] = new PlayeChessEngine.board.pieces.Piece(PlayeChessEngine.board.pieces.piece_type.no, true, -1, -1)
		this.board[start_coords[0]][start_coords[1]].coords = start_coords
		this.board[end_coords[0]][end_coords[1]].coords = end_coords
	}
	premove_check(move, white) {
		console.log("Premove check")
		let tmp_board = Object.assign(new PlayeChessEngine.board.Board(), this.board)
		this.transfer_piece(move.start_coords, move.end_coords)
		let is_check = this.is_check(white)
		this.board = Object.assign(new PlayeChessEngine.board.Board(), tmp_board)
		return is_check
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
			if (this.board[row][i].type != PlayeChessEngine.board.pieces.piece_type.no || this.get_all_landing_moves(!white).includes([row, i])) {
				return false
			}
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
				if (this.board[row][i].type == PlayeChessEngine.board.pieces.piece_type.p && this.board[row][i].is_white == white) {
					return [row, i]
				}
			}
		}
		return [-1, -1]
	}
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
	move(move) {
		console.log(this)
		let white = this.board[move.start_coords[0]][move.start_coords[1]].is_white
		if (move.included_in(this.get_moves(move.start_coords[0], move.start_coords[1]))) {
			console.log("OK")
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
}

PlayeChessEngine.status = {
	game_ongoing: 0,
	draw: 1,
	win: 2
}

PlayeChessEngine.draw = {
	stalemate: 0,
	insufficient_material: 1,
	fifty_moves_rule: 2,
	threefold_repetition: 3
}

PlayeChessEngine.win = {
	white: 0,
	black: 1
}

PlayeChessEngine.PCE = class PCE {
	moves = []
	boards = []
	board = new PlayeChessEngine.board.Board()
	move_countdown = 50

	constructor() {
		this.board.print_board()
		console.log(this.board)
	}

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
			return PlayeChessEngine.status.draw, PlayeChessEngine.draw.fifty_moves_rule
		}
		else if (this.board.check_threefold_repetition(white)) {
			return PlayeChessEngine.status.draw, PlayeChessEngine.draw.threefold_repetition
		}
		return PlayeChessEngine.status.game_ongoing
	}

	get_moves(x, y) {
		return this.board.get_moves(x, y)
	}

	move(x0, y0, x1, y1) {
		let mv = new PlayeChessEngine.Move(x0, y0, x1, y1)
		this.board.move(mv)
	}
}
