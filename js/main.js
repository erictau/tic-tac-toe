/*----- constants -----*/
const MAX_TOTAL_TURNS = 9;
const PLAYER_1_SYMBOL = 'X';
const PLAYER_2_SYMBOL = 'O';
const GRID_SIZE = 3;

/*----- app's state (variables) -----*/
const player1 = {
    symbol: PLAYER_1_SYMBOL,
    score: 0
}
const player2 = {
    symbol: PLAYER_2_SYMBOL,
    score: 0
}
const players = [player1, player2];
let turnNumber = 0;
let winner = '';
let numOfTieGames = 0;
let tie = 'tie';
let movesMade= [[],[],[]];

/*----- cached element references -----*/
const board = document.getElementById('board');
const dashboard = document.getElementById('dashboard');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const tieScores = document.getElementById('ties');
const playersTurn = document.getElementById('players-turn');

/*----- event listeners -----*/
board.addEventListener('click', handleBoardClick)
dashboard.addEventListener('click', handleDashboardClick);

/*----- functions -----*/

function init() {
    turnNumber = 0;
    winner = '';
    movesMade = [['','',''],['','',''],['','','']];
    renderPlayersTurn();
}

function resetScores() {
    // RESET STATS
    player1.score = 0;
    player2.score = 0;
    numOfTieGames = 0;
    init();
}

function handleBoardClick(evt) {
    if (!winner) {
    updateMoves(evt)
    }
}

function handleDashboardClick(evt) {
    if (evt.target.value === 'Reset Board') {
        init();
        renderBoard();
        let winMsg = document.getElementById('win-message');
        dashboard.removeChild(winMsg);
    } else if (evt.target.value === 'Reset Scores') {
        resetScores();
        renderBoard();
        let winMsg = document.getElementById('win-message');
        dashboard.removeChild(winMsg);
    }
}

function updateMoves(event) {
    const id = event.target.id
    const cellNum = parseInt(id.slice(id.length - 1)) - 1;
    let gridIndex = [Math.floor(cellNum/GRID_SIZE), cellNum % GRID_SIZE];
    if (!movesMade[gridIndex[0]][gridIndex[1]]) {
        movesMade[gridIndex[0]][gridIndex[1]] = players[turnNumber % 2].symbol;
        renderBoard();
        checkForWins();
        if (winner) {
            renderWinScreen();
            renderUpdatedScores();
        }
        turnNumber++;
        renderPlayersTurn();
    }
}

function checkForWins() {
    // CHECK ROWS
    for (let i = 0; i < GRID_SIZE; i++) {
        let referenceCell = movesMade[i][0];
        if (referenceCell &&
            referenceCell === movesMade[i][1] &&
            referenceCell === movesMade[i][2]) {
                if (assignWinner(referenceCell)) return;
            }
    }

    // CHECK COLUMNS
    for (let i = 0; i < GRID_SIZE; i++) {
        let referenceCell = movesMade[0][i];
        if (referenceCell &&
            referenceCell === movesMade[1][i] &&
            referenceCell === movesMade[2][i]) {
                if (assignWinner(referenceCell)) return;
            }
    }

    // CHECK DIAGONALS
    const centerCell = movesMade[1][1];
    if (centerCell === movesMade[0][0] &&
        centerCell === movesMade[2][2]) {
            if (assignWinner(centerCell)) return;
        }
    if (centerCell === movesMade[0][2] &&
        centerCell === movesMade[2][0]) {
            if (assignWinner(centerCell)) return;
        }

    // CHECK FOR TIE GAME
    if (!winner && turnNumber === MAX_TOTAL_TURNS - 1) {
        winner = tie;
        numOfTieGames++;   
    }
}

function assignWinner(refCell) {
    if (!winner) {    
        if (refCell === player1.symbol) {
            winner = 'Player 1'; 
            player1.score++;
            return winner;
        } else if (refCell === player2.symbol) {
            winner = 'Player 2';
            player2.score++;
            return winner;
        }
    }
}

function renderBoard() {
    movesMade.forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            board.children[rowIdx].children[cellIdx].innerText = cell;
        })
    })
}

function renderWinScreen() {
    let winMsg = document.createElement('h2');
    winMsg.id = 'win-message';
    if (winner && winner !== tie) {
        winMsg.innerText = `${winner} wins!`;
    } else {
        winMsg.innerText = `Tie game!`;
    }
    dashboard.appendChild(winMsg);
}

function renderUpdatedScores() {
    player1Score.innerText = player1.score;
    player2Score.innerText = player2.score;
    tieScores.innerText = `${numOfTieGames}`;
}

function renderPlayersTurn() {
    let turn = players[turnNumber % 2];
    playersTurn.innerText = `It is ${turn.symbol}'s turn!`;
    if (winner) {
        playersTurn.innerText = '';
    }
}

// START GAME
init();