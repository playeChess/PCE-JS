// export * from './pce';

import { PlayeChessEngine } from './pce.js';

let pce = new PlayeChessEngine.PCE("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
pce.main();