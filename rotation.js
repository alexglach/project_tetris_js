var TETRIS = TETRIS || {};

TETRIS.rotation = (function(game, piece) {

  var rowsRemoved = 0;
  var colsRemoved = 0;

  var rotate = function() {
    game.liftPiece();
    reduceOffset();
    if (piece.type === "fourAcross") {
      rotateFourAcross();
    } else if (piece.type === "farDown") {
      rotateFarDown();
    } else if (piece.type === "nearDown") {
      rotateNearDown();
    } else if (piece.type === "zigLow") {
      rotateZigLow();
    } else if (piece.type === "zigHigh") {
      rotateZigHigh();
    } else if (piece.type === "tBone") {
      rotateTBone();
    } 
    resetOffset();
  };

  var reduceOffset = function() {
    var blocks = piece.blocks;
    rowsRemoved = blocks[1][0] - 2;
    colsRemoved = blocks[1][1] - 1;
    for (var i = 0; i < blocks.length; i++) {
      blocks[i][0] -= rowsRemoved;
      blocks[i][1] -= colsRemoved;
    }
  };

  var resetOffset = function(){
    var blocks = piece.blocks;
    for (var i = 0; i < blocks.length; i++) {
      blocks[i][0] += rowsRemoved;
      blocks[i][1] += colsRemoved;
    }
  };

  var rotationConditional = function(pos1, pos2, pos3) {
    var newPieces;
    if(piece.rotationLoc % 4 === 1) {
      newPieces = pos1
    } else if (piece.rotationLoc % 4 === 2) {
      newPieces = pos2
    } else if (piece.rotationLoc % 4 === 3) {
      newPieces = pos3
    } else {
      newPieces = SHAPES[piece.type];
    }
    if (noRotateCollisions(newPieces)) {
      piece.blocks = newPieces;
    }
  }

  var rotateFourAcross = function() {
    if(piece.rotationLoc % 2 === 1) {
      var newPieces = [[3,1], [2,1], [1,1], [0,1]];
      if (noRotateCollisions(newPieces)) {
        piece.blocks = newPieces;
      }
    } else {
      var newPieces = SHAPES[piece.type];
      if (noRotateCollisions(newPieces)) {
        piece.blocks = SHAPES[piece.type];
      }
    }
  };

  var rotateFarDown = function() {
    var pos1 = [[3,0], [2,1], [3,1], [1,1]];
    var pos2 = [[1,0], [2,1], [2,0], [2,2]];
    var pos3 = [[3,1], [2,1], [1,2], [1,1]];
    rotationConditional(pos1, pos2, pos3);
  };

  var rotateNearDown = function() {
    var pos1 = [[1,0], [2,1], [1,1], [3,1]];
    var pos2 = [[2,0], [2,1], [1,2], [2,2]];
    var pos3 = [[3,1], [2,1], [3,2], [1,1]];
    rotationConditional(pos1, pos2, pos3);
  };

  var rotateZigLow = function() {
    var pos1 = [[1,1], [2,1], [2,2], [3,2]];
    var pos2 = [[3,0], [2,1], [3,1], [2,2]];
    var pos3 = [[1,1], [2,1], [2,2], [3,2]];
    rotationConditional(pos1, pos2, pos3);  
  };

  var rotateZigHigh = function() {
    var pos1 = [[3,1], [2,1], [2,2], [1,2]];
    var pos2 = [[2,0], [2,1], [3,1], [3,2]];
    var pos3 = [[3,1], [2,1], [2,2], [1,2]];
    rotationConditional(pos1, pos2, pos3);
  };

  var rotateTBone = function() {
    var pos1 = [[2,0], [2,1], [1,1], [3,1]];
    var pos2 = [[2,0], [2,1], [1,1], [2,2]];
    var pos3 = [[1,1], [2,1], [2,2], [3,1]];
    rotationConditional(pos1, pos2, pos3);
  };

  var noRotateCollisions = function(newPieces) {
    for (var i = 0; i < newPieces.length; i++) {
      var newRow = newPieces[i][0];
      var newCol = newPieces[i][1];
      if (newRow + rowsRemoved > BOARD_HEIGHT 
         || newCol + colsRemoved < 0 
         || newCol + colsRemoved >= BOARD_WIDTH) {
        return false;
      } else if (game.board[newRow][newCol]) {
        if (game.hittingCurrentPiece(newRow, newCol)) {
          return false;
        }
      }
    }
    return true;
  };

  return {
    rotate: rotate
  }
})(TETRIS.game, TETRIS.game.current_piece);
