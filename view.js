var TETRIS = TETRIS || {};

TETRIS.view = {

  init: function(){
    $(document).on('keydown', TETRIS.controller.keyListener);
  },

  render: function(board){
    $board = $('#board');
    $board.html("");

    for (var i = 4; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++){
        var cell = $('<div class="cell"></div>');
        $board.append(cell);

        if (board[i][j]) {
          cell.css('background-color', board[i][j]);
        }
      }
    }
  }





};