Gameboard = (function(){
  board = ['x','o','x','o','x','o','x','o'];

  function get () {
    return board;
  }

  function set (index, player) {
    if ((player !== 'x' && player !== 'o') || (index < 0 || index > 8)) return;
    if (board[index] !== undefined) return; //prevents overwriting of cells
    board[index] = player;
  }

  function reset () {
    //if ((Gameboard.get().includes(!undefined)) && (Gameboard.get().length === 9)) return;
    board = [];
  }

  return {get, set, reset};
})();


DisplayController = (function() {
  display = document.querySelectorAll('#grid .cell');

  function _clearPreviousRender () {
    display.forEach(cell => cell.textContent = '');
  }

  function render() {
    _clearPreviousRender();
    
    for (let i = 0; i < Gameboard.get().length; i++) {
      display[i].textContent = Gameboard.get()[i];
    }
  }



  return {render};
})();

Game = (function () {
  player = 'x';
  function playerSelection () {
    display.forEach( (cell, index) => cell.addEventListener('click', () => {
      Gameboard.set(index, player);
      DisplayController.render();
      switchPlayer();
      if ((!Gameboard.get().includes(undefined)) && Gameboard.get().length === 9) {
        Gameboard.reset();
        player = 'x';
      }
    }));
  }

  function switchPlayer () {
    if (player === 'x') {
      player = 'o';
    } else {
      player = 'x';
    }
  }
  return {playerSelection};
})();

DisplayController.render();
Game.playerSelection();

//if 012, 345, 678, 048, or 246 are all the same, win.
//if array.length = 6 && ^^ doesn't occur, tie.

//maybe the global namespacing issue can be fixed using factory functions.

//allow players to put in their names, include a button to start/restart the 
//game and add a display element that congratulates the winning player!