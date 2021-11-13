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
    if (Game.testForWinner()) board = ['','','','','','','','',''];
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




const Game = (function () {
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

  function testForWinner() {
    winner = 'none';
    board = Gameboard.get();
    winLines = [ [board[0],board[1],board[2]], [board[3],board[4],board[5]],
                 [board[6],board[7],board[8]], [board[0],board[3],board[6]],
                 [board[1],board[4],board[7]], [board[2],board[5],board[8]],
                 [board[0],board[4],board[8]], [board[2],board[4],board[6]] ];

    winLines.forEach(line => {
      if ((!line.includes('') && line.includes('x') && !line.includes('o')) ||
          (!line.includes('') && line.includes('o') && !line.includes('x'))) {

        if (line.includes('x')) {
          winner = player1;
        } else {
          winner = player2;
        }
      } 
    });

  console.log(winner);
  return winner;
  }


  function _playAgainstFriends(e) { //initializes a two-player game
    const index = e.target.getAttribute('data-key');
    Gameboard.set(index, player);
    DisplayController.render();
    _switchPlayer();
    if (testForWinner() !== 'none') {
      Gameboard.reset(); //
      player = 'x';
      return;
    }
    console.log('why does this fire');
  }

  function _playAgainstComputer(e) { //initializes Man vs Machine
    const index = e.target.getAttribute('data-key');
    Gameboard.set(index, player);
    DisplayController.render();
    _switchPlayer();

    if (!testForWinner() === 'none') {
      Gameboard.reset(); //
      player = 'x';
    }

    _computerSelect(); //will probably make the computer select all options after the initial selection, throw an if statement here.

    if (!testForWinner() === 'none') {
      Gameboard.reset(); //
      player = 'x';
    }
     //should be replaced with a gameEnd function. GameEnd
     //should display a winner, and have a restart button.     
    //restart button should call Gameboard.reset() and 
    //DisplayController.Render().
    return;
  }

  function chooseGameMode(mode) {
    DisplayController.getDisplay().forEach( (cell) => {
      cell.removeEventListener('click', _playAgainstFriends);
      cell.removeEventListener('click', _playAgainstComputer);
    });

    if (mode === 'friends') {
      DisplayController.getDisplay().forEach( (cell) => {
        cell.addEventListener('click', _playAgainstFriends)
      });
    } else if (mode === 'computer') {
      DisplayController.getDisplay().forEach( (cell) => {
        cell.addEventListener('click', _playAgainstComputer)
      });
    } else {
      return;
    }
  } //remember to ask how to achieve this the way I wanted to achieve it.


  return {chooseGameMode, testForWinner};
})();



Game.chooseGameMode('friends');

//if 012, 345, 678, 048, or 246 are all the same, win.
//if array.length = 8 && ^^ doesn't occur, tie.

//allow players to put in their names, include a button to start/restart the 
//game and add a display element that congratulates the winning player!

//find out why nested modules are declared in global space if not initialized 
//with var, let, or const.