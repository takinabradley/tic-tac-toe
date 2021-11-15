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
    board = ['','','','','','','','',''];
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

  function _testForWinner() {
    let winner = 'none';
    const board = Gameboard.get();
    const winLines = [
      [board[0],board[1],board[2]], [board[3],board[4],board[5]],
      [board[6],board[7],board[8]], [board[0],board[3],board[6]],
      [board[1],board[4],board[7]], [board[2],board[5],board[8]],
      [board[0],board[4],board[8]], [board[2],board[4],board[6]] 
    ];

    let isAllX = (currentValue) => currentValue === 'x';
    let isAllO = (currentValue) => currentValue === 'o';
    let isNotEmpty = (currentValue) => currentValue !== '';

    winLines.forEach(line => {
      if (line.every(isAllX) || line.every(isAllO)) {
        if (line.includes('x')) {
          winner = player1;
          return;
        } else {
          winner = player2;
          return;
        }
      }
    });

    if (winner === 'none' && board.every(isNotEmpty)) winner = 'tie';
    console.log(winner);
    return winner;
  }

  function _switchPlayer() {
    if (player === 'x') {
      player = 'o';
    } else {
      player = 'x';
    }
  }

  function _computerSelect() {
    availableCells= [];
    Gameboard.get().forEach( (cell, index) => {
      if(cell === '') availableCells.push(index);
    });
    Gameboard.set(availableCells[Math.floor(Math.random() * availableCells.length)], player) //need to get all *available* slots.
    DisplayController.render();
    _switchPlayer();
  }

  function _gameEnd() {
    Gameboard.reset(); //
    player = 'x';

    //gameEnd should display a winner, and have a restart button.     
    //restart button should call Gameboard.reset() and 
    //DisplayController.Render().*
  }

  function _playAgainstFriends(e) { //initializes a two-player game
    const index = e.target.getAttribute('data-key');
    Gameboard.set(index, player);
    DisplayController.render();
    _switchPlayer();
    if (_testForWinner() !== 'none') _gameEnd()
  }

  function _playAgainstComputer(e) { //initializes Man vs Machine
    const index = e.target.getAttribute('data-key');
    const computerTurn = () => {
      _computerSelect();
      if (_testForWinner() !== 'none') {
        _gameEnd()
      }
    };

    Gameboard.set(index, player);
    DisplayController.render();
    _switchPlayer();
    if (_testForWinner() !== 'none') {
      _gameEnd();
      return;
    }
    //setTimeout(() => {computerTurn()}, 500);
    setTimeout(computerTurn, 500);
    //does this technically return the function before computerTurn runs?
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
  } //Look for way to achieve this without data-keys.


  return {chooseGameMode, _testForWinner};
})();

Game.chooseGameMode('computer');

//allow players to put in their names, include a button to start/restart the 
//game and add a display element that congratulates the winning player!

//find out why nested modules are declared in global space if not initialized 
//with var, let, or const.