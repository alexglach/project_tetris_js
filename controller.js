var TETRIS = TETRIS || {};
INTERVAL = 500;

TETRIS.controller = {
  gameloop: {},

  play: function(){
    TETRIS.view.init();
    TETRIS.game.init();
    this.startGame();
  },

  keyListener: function(event) {
    TETRIS.game.userMove(event.which);
  },

  startGame: function() {
    gameLoop = setInterval( function(){
      TETRIS.game.tic();
      TETRIS.view.render(TETRIS.game.getCurrentState());
    }, INTERVAL);
  },

  stopGame: function() {
    clearInterval(gameLoop);
  }


};

$('document').ready(function(){
  TETRIS.controller.play();
});