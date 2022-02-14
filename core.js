const WINNER = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const BOARD = document.getElementById("game-body");
const SYMBOLS = ["😇", "😈"];
const TIMEOUT = 400;
const TIMEOUT_GEN = 120;
let players = [{name: '', score: 0}, {name: '', score: 0}];
let canPlay = false;
let playerTurn = 0;

function generateBoard() {
  BOARD.style.display = "block";
  BOARD.innerHTML = "";
  for (let count = 0; count <= 8; count++) {
    BOARD.innerHTML += `<button onclick="putSymbol(this)" class="game-button">☐</button>`;
  } 
  document.getElementById("nameScore").style.visibility = "visible"; 
  const SCORES = document.getElementById('scores');
  SCORES.innerHTML = "";
  SCORES.innerHTML += `<p class="score">${players[0].name}: ${players[0].score}</p>`;
  SCORES.innerHTML += `<p class="score">${players[1].name}: ${players[1].score}</p>`;
  canPlay = true;
}

function putSymbol(symbolArgs) {
  if (canPlay && symbolArgs.innerHTML == "☐") {
    symbolArgs.innerHTML = `<span class="animate">${SYMBOLS[playerTurn]}</span>`;
    symbolArgs.classList.add(`${playerTurn}`);
    symbolArgs.classList.add("marked");
    if (!checkWinner()) changePlayer();
  }
}

function changePlayer() {
  const PLAYER = document.getElementById("playerturn");
  playerTurn++;
  if (playerTurn == 2) playerTurn = 0;
  if (PLAYER.style.display == "block") {
    PLAYER.innerHTML = `Turn of ${players[playerTurn].name} ${SYMBOLS[playerTurn]}`;
  }
}

function checkWinner() {
  const BUTTONS = document.querySelectorAll(".game-button");
  WINNER.forEach(function(winner) {
    if (
      BUTTONS[winner[0]].classList.contains(`${playerTurn}`) &&
      BUTTONS[winner[1]].classList.contains(`${playerTurn}`) &&
      BUTTONS[winner[2]].classList.contains(`${playerTurn}`)
    ) {
      canPlay = false;
      setTimeout(() => {
        endGame(0);
      }, TIMEOUT);
      BUTTONS[winner[0]].classList.add("winner");
      BUTTONS[winner[1]].classList.add("winner");
      BUTTONS[winner[2]].classList.add("winner");
      return true;
    }
  })
  checkDraw(BUTTONS);
  return false;
}

function checkDraw(buttonsArg) {
  let marked = 0;
  buttonsArg.forEach(function(buttonArg) {
    if (buttonArg.classList.contains("marked")) marked++;
  });

  if (marked >= 9) {
    setTimeout(() => {
      endGame(1);
    }, TIMEOUT);
  }
}

function endGame(type) {
  let cardMsg = document.getElementById("card-message");
  document.getElementById("game-modal").style.display = "flex";
  cardMsg.innerHTML = "";
  cardMsg.innerHTML = `<p>Tie</p>`;
  if (type == 0) {
    players[playerTurn].score += 1;
    cardMsg.innerHTML = `<p>${SYMBOLS[playerTurn]} ${players[playerTurn].name} win!! ${SYMBOLS[playerTurn]}</p>`;
  }
}

function newPlay() {
  generateBoard();
  changePlayer();
  document.getElementById("game-modal").style.display = "none";
}

function setPlayerName() {
    const TIMEOUT_1 = TIMEOUT_GEN * 5;
    let inputs = document.querySelectorAll(".inputplayer");
    let names = document.querySelectorAll("h2");
    if (inputs[0].value != inputs[1].value) {
      players[0].name = inputs[0].value;
      players[1].name = inputs[1].value;
    } else {
      let warning = document.getElementById("input-warning");
      warning.style.visibility = "visible";
      setTimeout(() => {
        warning.style.visibility = "hidden";
      }, TIMEOUT_1);
    }
  
    if (players[0].name != "" && players[1].name != "") {
      inputs.forEach((inp) => {
        inp.style.display = "none";
      });
      names.forEach((name) => {
        name.style.display = "none";
      })
      document.getElementById("playerbtn").style.display = "none";
  
      generateBoard();
    
      document.getElementById("playerturn").style.display = "block";
      document.getElementById(
        "playerturn"
      ).innerHTML = `Turn of ${players[playerTurn].name} ${SYMBOLS[playerTurn]}`;
    }
}