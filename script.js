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
  const winnerDisplay = document.querySelector('#display');
  const buttonDisplay = document.querySelector('#buttons');

  function _clearLastBoardRender () {
    display.forEach(cell => cell.textContent = '');
  }

  function _displayNameForm() {
    removeButtons();
    
    const player1Input = document.createElement('input');
    player1Input.setAttribute('placeholder', 'Player 1');
    player1Input.setAttribute('value', 'Player 1')

    const player2Input = document.createElement('input');
    player2Input.setAttribute('placeholder', 'Player 2');
    player2Input.setAttribute('value', 'Player 2')

    const submitBtn = document.createElement('button')
    submitBtn.classList.add('friends');
    submitBtn.textContent = 'Start!';

    buttonDisplay.appendChild(player1Input);
    buttonDisplay.appendChild(player2Input);
    buttonDisplay.appendChild(submitBtn);

    submitBtn.addEventListener('click', () => {
      Game.setPlayerName(1, player1Input.value);
      Game.setPlayerName(2, player2Input.value);
    });

    submitBtn.addEventListener('click', Game.startGame);
    
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
    if (winner !== 'tie') {
      if (winner === 'You') {
        winnerDisplay.textContent = `You Win!`;
      } else {
        winnerDisplay.textContent = `${winner} Wins!`;
      }
    } else {
      winnerDisplay.textContent = `Tie!`;
    }
  }

  function clearWinner() {
    winnerDisplay.innerHTML = '';
  }

  function displayButtons() {
    const friendsBtn = document.createElement('button');
    friendsBtn.textContent = 'Play Against Friends'
    buttonDisplay.appendChild(friendsBtn);
    friendsBtn.addEventListener('click', _displayNameForm);

    const computerBtn = document.createElement('button');
    computerBtn.classList.add('computer');
    computerBtn.textContent = 'Play Against Computer';
    buttonDisplay.appendChild(computerBtn);
    computerBtn.addEventListener('click', Game.startGame)
  }

  function removeButtons() {
    const buttons = document.querySelectorAll('#buttons button')

    buttons.forEach(button => {
      button.addEventListener('click', Game.startGame);
    });

    buttonDisplay.innerHTML = '';
  }

  return {getDisplay, renderBoard, displayWinner, displayButtons, clearWinner, removeButtons};
})();




const Game = (function () {
  let player = 'x';
  let player1 = 'Player 1'; //player1 is x
  let player2 = 'Player 2'; //player2 is o

  function minimax(board, player) {
    //find available cells of each board that passes through the function
    let availableCells = _getAvailableCells(board);

    //attributes a higher score to favorable outcomes
    if(_testForWinner(board) === player1) {
      return {score: -10};
    } else if (_testForWinner(board) === player2) {
      return {score: 10};
    } else if (_testForWinner(board) === 'tie') {
      return {score: 0};
    }

    //apply the score to all available moves and save them
    let moves = [];

    availableCells.forEach( cell => {
      let move = {};
      move.index = cell;
      board[cell] = player;


      if (player === 'o') {
        let result = minimax(board, 'x');
        move.score = result.score;
      } else {
        let result = minimax(board, 'o');
        move.score = result.score;
      }
  
      board[cell] = '';
  
      moves.push(move);
    })

    //find most favorable score out of all saved moves
    let bestMove;
  
    if(player === 'o') {
      let bestScore = Number.NEGATIVE_INFINITY;
      moves.forEach( (move, indexOfBestScore) => {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = indexOfBestScore;
        }
      })
    } else {
      let bestScore = Number.POSITIVE_INFINITY;
      moves.forEach( (move, indexOfBestScore) => {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = indexOfBestScore;
        }
      })
    }
    //return the best move
    return moves[bestMove];
  }

  function _testForWinner(optionalBoard) {
    let winner = 'none';
    let board;
    if (optionalBoard) {
      board = optionalBoard;
    } else {
      board = Gameboard.get();
    }

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
    return winner;
  }

  function _switchPlayer() {
    if (player === 'x') {
      player = 'o';
    } else {
      player = 'x';
    }
  }

  function _getAvailableCells(optionalBoard) {
    availableCells = [];

    if (optionalBoard) {
      optionalBoard.forEach( (cell, index) => {
        if(cell === '') availableCells.push(index);
      });
    } else {
      Gameboard.get().forEach( (cell, index) => {
        if(cell === '') availableCells.push(index);
      });
    }

    return availableCells;
  }

  function _computerSelect() {
    let move = minimax(Gameboard.get(), 'o').index;
    DisplayController.getDisplay()[move].removeEventListener('click', _playAgainstComputer);
    Gameboard.set(move, player) 
    DisplayController.renderBoard();
    _switchPlayer();
  }

  function _gameEnd() {
    DisplayController.getDisplay().forEach( (cell) => {
      cell.removeEventListener('click', _playAgainstFriends);
      cell.removeEventListener('click', _playAgainstComputer);
    });

    DisplayController.displayWinner(_testForWinner());
    Gameboard.reset();
    player = 'x';

    DisplayController.displayButtons();
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

    //player turn//
    Gameboard.set(index, player);
    DisplayController.renderBoard();
    _switchPlayer();
    if (_testForWinner() !== 'none') {
      _gameEnd();
      return;
    }
    //computer Turn
    setTimeout( () => {
      _computerSelect();
      if (_testForWinner() !== 'none') {
        _gameEnd()
      }
    }, 50);
  }

  function startGame(e) { //takes button events from DisplayController
    if (e.target.classList.contains('friends')) {
      DisplayController.getDisplay().forEach( (cell) => {
        cell.addEventListener('click', _playAgainstFriends, {once: true})
      });
    } else if (e.target.classList.contains('computer')) {
      player1 = 'You';
      player2 = 'Computer';
      DisplayController.getDisplay().forEach( (cell) => {
        cell.addEventListener('click', _playAgainstComputer, {once: true})
      });
    }
    //Look for a good way to pass index of cell in nodelist to 
    //_playAgainstComputer instead of using data-keys. I can't figure out a way
    //to remove it when I do that. Ex:
    //  DisplayController.getDisplay().forEach( (cell, index) => {
    //    eventHandler = () => playAgainstComputer(index);
    //    cell.addEventListener('click', eventHandler);
    //  });
    //can't define this 'eventHandler' outside of forEach() loop because 'index'
    //doesn't exist outside of it.


    DisplayController.removeButtons();
    DisplayController.clearWinner();
    DisplayController.renderBoard();
  } 

  function setPlayerName(player, name) {
    if (player === 1) {
      player1 = name;
    } else if (player === 2) {
      player2 = name;
    } else {
      return;
    }
  }

  return {startGame, setPlayerName};
})();

DisplayController.displayButtons();