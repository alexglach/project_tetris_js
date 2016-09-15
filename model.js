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

SHAPENAMES = ["fourAcross", 
              "farDown", 
              "nearDown",
              "zigLow",
              "zigHigh",
              "square",
              "tBone"
];

SHAPES = {
  fourAcross: [[2,0], [2,1], [2,2], [2,3]], // FOUR ACROSS
  farDown: [[2,0], [2,1], [2,2], [3,2]], // L WITH FAR SIDE DOWN
  nearDown: [[2,0], [2,1], [2,2], [3,0]], // L WITH NEAR SIDE DOWN
  zigLow: [[3,0], [2,1], [3,1], [2,2]], // ZIG WITH NEAR SIDE LOWER
  zigHigh: [[2,0], [2,1], [3,1], [3,2]], // ZIG WITH NEAR SIDE HIGHER
  square: [[1,1], [2,1], [2,2], [1,2]], // SQUARE
  tBone: [[2,0], [2,1], [3,1], [2,2]] // T-Bone
};

TETRIS.game = {

  init: function() {
    this.createBoard();
    this.createPiece();
    this.score = 0;
  },

  createBoard: function(){
    this.board = new Array(BOARD_HEIGHT);

    for(var i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(BOARD_WIDTH);
    }
  },

  createPiece: function() {
    this.current_piece.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.current_piece.type = TETRIS.game.findShapeType();
    this.current_piece.blocks = TETRIS.game.findShape(this.current_piece.type);
    console.log(this.current_piece.type);
    TETRIS.game.addRightOffset();
    this.current_piece.rotationLoc = 0;
  },

  findShapeType: function() {
    return SHAPENAMES[Math.floor(Math.random() * SHAPENAMES.length)]
  },

  findShape: function(type){
    var shape =  SHAPES[type];
    var piece = [];
    var block;
    for (var i = 0; i < shape.length; i++) {
      block = [];
      for (var j = 0; j < shape[i].length; j++){
        block.push(shape[i][j]);
      }
      piece.push(block);
    }
    return piece;
  },

  addRightOffset: function() {
    var blocks = TETRIS.game.current_piece.blocks;
    var pushRightAmt = Math.floor(Math.random() * (BOARD_WIDTH - 3));
    for (var i = 0; i < blocks.length; i++) {
      blocks[i][1] += pushRightAmt;
    }
  },

  userMove: function(keycode) {
    console.log(keycode);
    if (keycode === 37) {
      TETRIS.game.moveLaterally(-1);
    } else if (keycode === 39) {
      TETRIS.game.moveLaterally(1);
    } else if (keycode === 40) {
      TETRIS.game.dropPiece();
    } else if (keycode === 32) {
      var current_piece = TETRIS.game.current_piece
      current_piece.rotationLoc += 1;
      TETRIS.rotation.rotate();
    }
  },

  notHittingCurrentPiece: function(pieceRow, newCol){
    var current_blocks = TETRIS.game.current_piece.blocks;
    var currentPiece = true;
    for (var j = 0; j < current_blocks.length; j++) {
      if ((current_blocks[j][0] === pieceRow) && 
          (current_blocks[j][1] === newCol)){
        currentPiece = false;
      } 
    }
    return currentPiece;
  },

  checkLegalLateral: function(direction, current_blocks){
    for(var i = 0; i < current_blocks.length; i++) {
      var newCol = current_blocks[i][1] + direction;
      var pieceRow = current_blocks[i][0];
      if (newCol >= BOARD_WIDTH || newCol < 0 ){
        return false;
      } else if (TETRIS.game.board[pieceRow][newCol]) {
          if (TETRIS.game.notHittingCurrentPiece(pieceRow, newCol)) {
            return false;
          }
      }
    }
    return true;
  },

  moveLaterally: function(direction) {
    var current_blocks = TETRIS.game.current_piece.blocks;
    if (TETRIS.game.checkLegalLateral(direction, current_blocks)){
      TETRIS.game.liftPiece();
      for(i = 0; i < current_blocks.length; i++) {
        current_blocks[i][1] += direction;
      }
      return true;
    };
  },

  dropPiece: function(){
    while(TETRIS.game.movePieceDownOne());
  },

  movePieceDownOne: function() {     
    var current_blocks = TETRIS.game.current_piece.blocks
    if (TETRIS.game.noCollisionBelow()) {
      TETRIS.game.liftPiece();
      for(i = 0; i < current_blocks.length; i++) {
        current_blocks[i][0] += 1;
      }
      TETRIS.game.updateBoardWithNewPiece(current_blocks);
      return true;
    } else {
      TETRIS.game.createPiece();
      return false;
    }

  },

  updateBoardWithNewPiece: function(current_blocks){
    for(i = 0; i < current_blocks.length; i++) {
      var row = current_blocks[i][0];
      var col = current_blocks[i][1];
      TETRIS.game.board[row][col] = TETRIS.game.current_piece.color;
    } 
  },

  noCollisionBelow: function() {
    var current_blocks = TETRIS.game.current_piece.blocks;
    for(var i = 0; i < current_blocks.length; i++) {
      var new_row = current_blocks[i][0] + 1;
      var col = current_blocks[i][1];
      if (new_row === BOARD_HEIGHT){
        return false;
      } else if (TETRIS.game.board[new_row][col]) {
          if (TETRIS.game.notHittingCurrentPiece(new_row, col)) {
            if(new_row < 4) {
              TETRIS.controller.stopGame();
              alert("You Lose!");
            }
            return false;
          }
      }  
    }
    return true;
  },

  getCurrentState: function() {
    return [TETRIS.game.board, TETRIS.game.score];
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
        TETRIS.game.score += 10;
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