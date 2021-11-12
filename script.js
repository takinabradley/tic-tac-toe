const Game = (function () {
  //Nested Modules
  const Gameboard = (function(){
    let board = ['','','','','','','','',''];
  
    function get () {
      return board;
    }
  
    function set (index, player) {
      if ((player !== 'x' && player !== 'o') || index < 0 || index > 8) return;
      if (board[index] !== '') return; //prevents overwriting of cells
      board[index] = player;
    }
  
    function reset () {
      if (!Gameboard.get().includes('')) board = ['','','','','','','','',''];
    }
  
    return {get, set, reset};
  })();


  const DisplayController = (function() {
    const display = document.querySelectorAll('#grid .cell');
  
    function _clearPreviousRender () {
      display.forEach(cell => cell.textContent = '');
    }
    
    function getDisplay () {
      return display;
    }

    function render() {
      _clearPreviousRender();
      console.log(this);
      display.forEach( (cell, index) => {
        cell.textContent = Gameboard.get()[index];
      });
    }
  
    return {getDisplay, render};
  })();


  //Game-specific properties and methods
  let player = 'x';
  let player1 = 'Player 1'; //player1 is x
  let player2 = 'Player 2'; //player2 is o

  function _switchPlayer() {
    if (player === 'x') {
      player = 'o';
    } else {
      player = 'x';
    }
  }

  function _computerSelect() {
    //computer selection code
    _switchPlayer();
  }

  function playAgainstFriends(index) { //initializes a two-player game 
      Gameboard.set(index, player);
      DisplayController.render();
      _switchPlayer();
      if (!Gameboard.get().includes('')) {
        Gameboard.reset();//should be replaced with a gameEnd function. GameEnd
        player = 'x';     //should display a winner, and have a restart button.     
      }                   //restart button should call Gameboard.reset() and 
                          //DisplayController.Render().
      return;
  }

  function playAgainstMachine(index) { //initializes Man vs Machine
      Gameboard.set(index, player);
      DisplayController.render();
      _switchPlayer();
      _computerSelect(); //will probably make the computer select all options after the initial selection, throw an if statement here.
      if (!Gameboard.get().includes('')) {
        Gameboard.reset();//should be replaced with a gameEnd function. GameEnd
        player = 'x';     //should display a winner, and have a restart button.     
      }                   //restart button should call Gameboard.reset() and 
                          //DisplayController.Render().
      return;
  }

  function chooseGameMode(mode) {
    DisplayController.getDisplay().forEach( (cell, i) => {
      cell.removeEventListener('click', playAgainstFriends);
      cell.removeEventListener('click', playAgainstMachine);
    });

    if (mode === 1) {
      DisplayController.getDisplay().forEach( (cell, i) => {
        cell.addEventListener('click', playAgainstFriends.bind(DisplayController, i), {once: true});
      });
    } else if (mode === 2) {
      DisplayController.getDisplay().forEach( (cell, i) => {
        cell.addEventListener('click', playAgainstMachine.bind(DisplayController, i), {once: true});
      });
    }
  }


  return {playAgainstFriends, playAgainstMachine, chooseGameMode, DisplayController};
})();



//Game.chooseGameMode(1);

//if 012, 345, 678, 048, or 246 are all the same, win.
//if array.length = 8 && ^^ doesn't occur, tie.

//allow players to put in their names, include a button to start/restart the 
//game and add a display element that congratulates the winning player!

//find out why nested modules are declared in global space if not initialized 
//with var, let, or const.