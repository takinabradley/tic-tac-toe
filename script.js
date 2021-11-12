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
      for (let i = 0; i < Gameboard.get().length; i++) {
        display[i].textContent = Gameboard.get()[i];
      }
    }
  
    return {getDisplay, render};
  })();


  //Game-specific properties and methods
  let player = 'x';

  function _switchPlayer () {
    if (player === 'x') {
      player = 'o';
    } else {
      player = 'x';
    }
  }

  function allowPlayerSelection () { //initializes a two-player game 
    DisplayController.getDisplay().forEach( (cell, index) => cell.addEventListener('click', () => {
      Gameboard.set(index, player);
      DisplayController.render();
      _switchPlayer(); //could make another method that replaces _switchPlayer with a computerSelect() function to play against a computer
      if (!Gameboard.get().includes('')) {
        Gameboard.reset();//should be replaced with a gameEnd function. GameEnd
        player = 'x';     //should display a winner, and have a restart button.     
      }                   //restart button should call Gameboard.reset() and 
    }));                  //DisplayController.Render().
  }

  return {
    //DisplayController: {render: DisplayController.render}, //picks a single function out of DisplayController for global use.
    allowPlayerSelection
  };
})();


Game.allowPlayerSelection();

//if 012, 345, 678, 048, or 246 are all the same, win.
//if array.length = 8 && ^^ doesn't occur, tie.

//allow players to put in their names, include a button to start/restart the 
//game and add a display element that congratulates the winning player!

//find out why nested modules are declared in global space if not initialized 
//with var, let, or const.