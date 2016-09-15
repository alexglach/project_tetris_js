var TETRIS = TETRIS || {};

BOARD_WIDTH = 10;
BOARD_HEIGHT = 20 + 4;
COLORS = [
  "red",
  "green",
  "blue",
  "orange",
  "yellow",
  "purple"
];
SHAPES = [
  [[3,0], [3,1], [3,2], [3,3]], // FOUR ACROSS
  [[1,0], [2,0], [2,1], [3,1]], // ZIG WITH LEFT SIDE UP
  [[3,0], [2,0], [2,1], [1,1]], // ZIG WITH RIGHT SIDE UP 
  [[3,0], [2,0], [2,1], [3,1]], // SQUARE
  [[3,0], [2,0], [1,0], [1,1]], // L RIGHT
  [[3,1], [2,1], [1,1], [1,0]], // L LEFT  
]

// model
//  gameboard = nested array that adds set pieces as they are set
//  current_piece = array of coordinates [[[1,2][1,3][1,4]], orange]
//  
//  

TETRIS.game = {

  init: function() {
    this.createBoard();
    this.createPiece();
  },

  createBoard: function(){
    this.board = new Array(BOARD_HEIGHT);

    for(var i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(BOARD_WIDTH);
    }
  },

  createPiece: function() {
    this.current_piece.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.current_piece.blocks = TETRIS.game.findShape();
  },

  findShape: function(){
    var shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return shape;
  },


  userMove: function(keycode) {
    console.log(keycode);
    if (keycode === 37) {
      console.log(TETRIS.game.moveLaterally(-1))

    } else if (keycode === 39) {
      TETRIS.game.moveLaterally(1)
    } else if (keycode === 40) {
      TETRIS.game.dropPiece();
    }
  },

  moveLaterally: function(direction) {
    var current_blocks = TETRIS.game.current_piece.blocks
    for(i = 0; i < current_blocks.length; i++) {
      var newCol = current_blocks[i][1] + direction
      var pieceRow = current_blocks[i][0]
      if (newCol >= BOARD_WIDTH || newCol < 0 ){
        return false;
      } else if (TETRIS.game.board[pieceRow][newCol]) {
        for (j = 0; j < current_blocks.length; j++) {
          if (current_blocks[j][0] !== pieceRow && current_blocks[j][1] !== newCol) {
            return false;
          }
        }
      }
    }
    for(var k = 0; k < TETRIS.game.current_piece.blocks.length; k++) {
        var row = TETRIS.game.current_piece.blocks[k][0];
        var col = TETRIS.game.current_piece.blocks[k][1];
        TETRIS.game.board[row][col] = undefined;
      }   
    for(i = 0; i < current_blocks.length; i++) {
      current_blocks[i][1] += direction;
    }
    console.log(current_blocks);
    return true;
  },

  dropPiece: function(){
    while(TETRIS.game.movePieceDownOne());
  },

  movePieceDownOne: function() {     

    if (TETRIS.game.noCollision()) {
      for(var i = 0; i < TETRIS.game.current_piece.blocks.length; i++) {
        var row = TETRIS.game.current_piece.blocks[i][0];
        var col = TETRIS.game.current_piece.blocks[i][1];
        TETRIS.game.board[row][col] = undefined;
      } 

      for(i = 0; i < TETRIS.game.current_piece.blocks.length; i++) {
        TETRIS.game.current_piece.blocks[i][0] += 1;
      }

      for(i = 0; i < TETRIS.game.current_piece.blocks.length; i++) {
        row = TETRIS.game.current_piece.blocks[i][0];
        col = TETRIS.game.current_piece.blocks[i][1];
        TETRIS.game.board[row][col] = TETRIS.game.current_piece.color;
      } 
      console.log("Once?");
      return true;
    } else {
      TETRIS.game.createPiece();
      return false;
    }

  },

  noCollision: function() {
    var current_blocks = TETRIS.game.current_piece.blocks
    for(i = 0; i < current_blocks.length; i++) {
      var new_row = current_blocks[i][0] + 1;
      var col = current_blocks[i][1];

      if (new_row === BOARD_HEIGHT){
        return false;
      } else if (TETRIS.game.board[new_row][col]) {
          for (j = 0; j < current_blocks.length; j++) {
            if ((current_blocks[j][0] === new_row) && 
                (current_blocks[j][1] === col)){
              console.log("Happens before first move?")
              continue;
            } else {
              return false;
            }
          }
      }
    }
    return true;
  },

  getCurrentState: function() {
    // var tempBoard = TETRIS.game.board.slice(0);
    // for (var i = 0; i < current_blocks.length; i++) {
    //   var row = TETRIS.game.current_piece.blocks[i][0];
    //   var col = TETRIS.game.current_piece.blocks[i][1];
    //   tempBoard[row][col] = TETRIS.game.current_piece.color;
    // }
    // return tempBoard;
    return TETRIS.game.board
  },

  tic: function(){
    this.movePieceDownOne();
    this.deleteFullRows();
  },

  current_piece: {},

  deleteFullRows: function(){
    for (var i = 4; i < BOARD_HEIGHT; i++) {
      var markForDelete = true;
      var row = TETRIS.game.board[i]
      for (var col = 0; col < BOARD_WIDTH; col++){
        if (!row[col]) {
          markForDelete = false;
          break;
        }
      }
      if (markForDelete) {
        TETRIS.game.board.splice(i, 1);
        TETRIS.game.liftPiece();
        TETRIS.game.addRow();
      }
    }
  },

  addRow: function(){
    var newRow = new Array(BOARD_WIDTH);
    TETRIS.game.board.unshift(newRow);
  },

  liftPiece: function(){
    for(var i = 0; i < TETRIS.game.current_piece.blocks.length; i++) {
        var row = TETRIS.game.current_piece.blocks[i][0];
        var col = TETRIS.game.current_piece.blocks[i][1];
        TETRIS.game.board[row][col] = undefined;
    } 
  }


};