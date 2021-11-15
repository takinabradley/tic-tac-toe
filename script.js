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

  function _clearLastBoardRender () {
    display.forEach(cell => cell.textContent = '');
  }
  
  function getDisplay () {
    return display;
  }

  function renderBoard() {
    _clearLastBoardRender();
    display.forEach( (cell, index) => {
      cell.textContent = Gameboard.get()[index];
    });
  }

  function displayWinner(winner) {
    winnerDisplay = document.querySelector('#display');
    if (winner !== 'tie') {
      winnerDisplay.textContent = `${winner} Wins!`;
    } else {
      winnerDisplay.textContent = `Tie!`;
    }
  }

  function removeWinner() {
    winnerDisplay = document.querySelector('#display');
    winnerDisplay.innerHTML = '';
  }

  function displayButtons() {
    buttonDisplay = document.querySelector('#buttons');

    friendsBtn = document.createElement('button');
    friendsBtn.classList.add('friends');
    friendsBtn.textContent = 'Play Against Friends'
    buttonDisplay.appendChild(friendsBtn);

    computerBtn = document.createElement('button');
    computerBtn.classList.add('computer');
    computerBtn.textContent = 'Play Against Computer';
    buttonDisplay.appendChild(computerBtn);

    buttons = document.querySelectorAll('#buttons button')
    buttons.forEach(button => {
      button.addEventListener('click', Game.startGame);
    });
  }

  function removeButtons() {
    buttonDisplay = document.querySelector('#buttons');
    buttons = document.querySelectorAll('#buttons button')

    buttons.forEach(button => {
      button.addEventListener('click', Game.startGame);
    });

    buttonDisplay.innerHTML = '';
  }

  return {getDisplay, renderBoard, displayWinner, displayButtons, removeWinner, removeButtons};
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

    let isX = (currentValue) => currentValue === 'x';
    let isO = (currentValue) => currentValue === 'o';
    let isNotEmpty = (currentValue) => currentValue !== '';

    winLines.forEach(line => {
      if (line.every(isX) || line.every(isO)) {
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
    availableCells = [];
    Gameboard.get().forEach( (cell, index) => {
      if(cell === '') availableCells.push(index);
    });
    randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    DisplayController.getDisplay()[randomCell].removeEventListener('click', _playAgainstComputer);
    Gameboard.set(randomCell, player) //need to get all *available* slots.
    DisplayController.renderBoard();
    _switchPlayer();
  }

  function _gameEnd() { //maybe all removing of event listeners should happen here.
    DisplayController.getDisplay().forEach( (cell) => {
      cell.removeEventListener('click', _playAgainstFriends);
      cell.removeEventListener('click', _playAgainstComputer);
    });

    DisplayController.displayWinner(_testForWinner());
    Gameboard.reset();
    player = 'x';

    DisplayController.displayButtons();
    //startGame

    //gameEnd should display a winner, and have a restart button.     
    //restart button should call Gameboard.reset() and 
    //DisplayController.renderBoard().*
  }

  function _playAgainstFriends(e) { //initializes a two-player game
    const index = e.target.getAttribute('data-key');
    Gameboard.set(index, player);
    DisplayController.renderBoard();
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
    //player turn//
    Gameboard.set(index, player);
    DisplayController.renderBoard();
    _switchPlayer();
    if (_testForWinner() !== 'none') {
      _gameEnd();
      return;
    }
    //computer Turn
    setTimeout(computerTurn, 100);
  }

  function startGame(e) {
    if (e.target.classList.contains('friends')) {
      DisplayController.getDisplay().forEach( (cell) => {
        cell.addEventListener('click', _playAgainstFriends, {once: true})
      });
    } else if (e.target.classList.contains('computer')) {
      DisplayController.getDisplay().forEach( (cell) => {
        cell.addEventListener('click', _playAgainstComputer, {once: true})
      });
    } else {
      return;
    }

    DisplayController.removeButtons();
    DisplayController.removeWinner();
    DisplayController.renderBoard();
  } //Look for way to achieve this without data-keys.
    //(pass index of cell to _playAgainstComputer instead of the event)

  return {startGame, _testForWinner};
})();

DisplayController.displayButtons();

//allow players to put in their names, include a button to start/restart the 
//game and add a display element that congratulates the winning player!

//find out why nested modules are declared in global space if not initialized 
//with var, let, or const.