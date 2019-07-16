window.onload = () => {

  let currentPlayer;

  let getStartPlayer = () => {
    let random = Math.floor(Math.random() * 2) + 1;
    return (random === 1) ? 'cross' : 'zero';
  };

  let changePlayer = () => {
    let move = document.querySelector('.movePlayer');
    move.classList.remove(`movePlayer-${currentPlayer}`);
    currentPlayer = currentPlayer === 'cross' ? 'zero' : 'cross';
    move.classList.add(`movePlayer-${currentPlayer}`);
  };

  let clearField = () => {
    let cells = [...document.querySelectorAll('.cell')];
    cells.map((item) => {
      item.dataset.status = 'empty';
      item.classList.remove('cell-zero');
      item.classList.remove('cell-cross');
      item.classList.remove('cell-win');
    });
  };

  let checkWinner = () => {
    let crossMoves = [];
    let zeroMoves = [];
    let cells = [...document.querySelectorAll('.cell')];
    let wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    cells.map((item) => {
      if (item.dataset.status === 'cross') {
        crossMoves.push(+item.dataset.id);
      } else if (item.dataset.status === 'zero') {
        zeroMoves.push(+item.dataset.id);
      };
    });
    if (crossMoves.length + zeroMoves.length >=9) {
      handleDraw();
    };

    let checkedPlayer = (currentPlayer === 'cross') ? crossMoves : zeroMoves;
    wins.map((item) => {
      let check = item.filter((elem) => {
          return checkedPlayer.includes(elem);
      });
      if (check.length === 3) {
        handleWin(item);
      };
    });
  };

  let handleMove = (e) => {
    if (e.target.dataset.status === 'empty') {
      e.target.dataset.status = currentPlayer;
      e.target.classList.add(`cell-${currentPlayer}`);
      checkWinner();
      changePlayer()
    };
  };

  let removeListener = () => {
    cells = [...document.querySelectorAll('.cell')];
    cells.map((item) => {
      item.removeEventListener('click', handleMove);
    });
  };

  let newGame = () => {
    clearField();
    document.querySelector('.endGame').innerHTML = "";
    currentPlayer = getStartPlayer();
    changePlayer();
    cells = [...document.querySelectorAll('.cell')];
    cells.map((item) => {
      item.addEventListener('click', handleMove);
    });
  };

  let handleWin = (elems) => {
    let cells = [...document.querySelectorAll('.cell')];
    cells.map((item) => {
      if (elems.includes(+item.dataset.id)) {
        item.classList.add('cell-win');
      };
    });
    removeListener();
    document.querySelector('.endGame').innerHTML = "Победа!!!";
  };

  handleDraw = () => {
    removeListener();
    document.querySelector('.endGame').innerHTML = "Ничья";
  };

  newGame();
  let buttons = [...document.querySelectorAll('.start')];
  buttons.map((item) => {
    item.addEventListener('click', newGame);
  });
};