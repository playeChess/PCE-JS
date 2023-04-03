# PCE-JS

![](https://img.shields.io/badge/version-DEV-ff264a?style=for-the-badge)
![](https://img.shields.io/badge/Status-In_Progress-ffdf29?style=for-the-badge)
![](https://img.shields.io/badge/Made%20for-eChess-11482f?style=for-the-badge)
![](https://img.shields.io/github/languages/code-size/playeChess/PCE-JS?label=size&style=for-the-badge)
![](https://img.shields.io/badge/Made%20in-Javascript-F7DF1E?logo=javascript&style=for-the-badge)

PCE-JS is a chess engine for [playeChess](playechess.com)

## User functions

### PCE.status()

#### Description

Gets the status of the game

#### Returns

##### status_id

- Type: int
- Description: The status id (0 -> game ongoing; 1 -> draw; 2 -> win)
- Optionnal: No

##### detail_id

- Type: int
- Description: Only for status_id=1 (0: stalemate; 1: insufficient material; 2: 50 moves rule; 3: threefold repetition) and status_id=2 (0: white, 1: black)
- Optionnal: Yes

### PCE.getMoves(white)

#### Description

Gets all possible moves for a player

#### Arguments

##### white

- Type: bool
- Description: Whether the player we want his moves is white
- Optionnal: No

#### Returns

##### moves

- Type: array[array[array[int]]
- Description: All the possible moves (returned as an array of [[start_x, start_y], [end_x, end_y]])
- Optionnal: No

### PCE.move(start_pos, end_pos)

#### Description

Moves a piece from start_pos to end_pos

#### Arguments

##### start_pos

- Type: array[int]
- Description: The start coordinates
- Optionnal: No

##### end_pos

- Type: array[int]
- Description: The end coordinates
- Optionnal: No
