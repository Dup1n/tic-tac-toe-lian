const BOARD = document.getElementById("game-body");
const SYMBOLS = ["😇", "😈"];
const TIMEOUT_GEN = 120;
let players = [{name: '', score: 0}, {name: '', score: 0}];
let winner = [];
let winnerI = [];
let canPlay = false;
let playerTurn = 0;
let numberBox = 3;
let boardBoxes = 9;

function generateBoard() {
  BOARD.style.display = "block";
  BOARD.innerHTML = "";
  for (let count = 0; count < boardBoxes; count++) {
    BOARD.innerHTML += `<button onclick="putSymbol(this)" class="game-button">☐</button>`;
  } 
  resizeBoxes();
  document.getElementById("nameScore").style.visibility = "visible"; 
  const SCORES = document.getElementById('scores');
  SCORES.innerHTML = "";
  SCORES.innerHTML += `<p class="score">${players[0].name}: ${players[0].score}</p>`;
  SCORES.innerHTML += `<p class="score">${players[1].name}: ${players[1].score}</p>`;
  canPlay = true;
}

function setPositionsWinner(){
  for (let i = 0; i < boardBoxes; i += numberBox) {
    winnerI = [];
    for (let j = 0; j < numberBox; j++) {
      winnerI.push(i + j);
    }
    winner.push(winnerI);
  }

  for (let i = 0; i < numberBox; i++) {
    winnerI = [];
    for (let j = 0; j < numberBox; j++) {
      winnerI.push(i + (numberBox * j));
    }
    winner.push(winnerI);
  }

  winnerI = [];
  for (let i = 0; i < boardBoxes; i = i + (numberBox + 1)) {
    winnerI.push(i);
  }
  winner.push(winnerI);

  winnerI = [];
  for (let i = (numberBox - 1); i < (boardBoxes - 1); i = i + (numberBox - 1)) {
    winnerI.push(i);
  }
  winner.push(winnerI);
}

function resizeBoxes(){
  const gameButtons = document.getElementsByClassName("game-button");
  const sizeBox = numberBox >= 5 ? 5 * (7 + (9 - numberBox)) : 5 * (13 + ((4 - numberBox) * 5));
  const fontSizeBox = numberBox >= 5 ? 20 : 40;
  for (let index = 0; index < gameButtons.length; index++) {
    gameButtons[index].style.width = `${sizeBox}px`;
    gameButtons[index].style.height = `${sizeBox}px`;
    gameButtons[index].style.fontSize = `${fontSizeBox}px`;
  }
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


function isWinner(winnerChoose, BUTTONS) {
  return winnerChoose.reduce((previousWinner, currentWinner) => {
    return previousWinner && BUTTONS[currentWinner].classList.contains(`${playerTurn}`);
  }, true);
}

function winnerMarkButton(winnerChoose, BUTTONS){
  winnerChoose.forEach(currentWinner => {
    BUTTONS[currentWinner].classList.add("winner");
  })
}

function checkWinner() {
  const BUTTONS = document.querySelectorAll(".game-button");
  winner.forEach(function(winnerChoose) {
    if (isWinner(winnerChoose, BUTTONS)) {
      console.log(playerTurn);
      canPlay = false;
      endGame(0);
      winnerMarkButton(winnerChoose, BUTTONS);
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

  if (marked >= boardBoxes) {
    endGame(1);
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

    if (inputs[2].value != ""){
      numberBox = parseInt(inputs[2].value);
      boardBoxes = numberBox * numberBox;
    }
  
    if (players[0].name != "" && players[1].name != "") {
      inputs.forEach((inp) => {
        inp.style.display = "none";
      });
      names.forEach((name) => {
        name.style.display = "none";
      })
      document.getElementById("playerbtn").style.display = "none";

      setPositionsWinner();
      generateBoard();
    
      document.getElementById("playerturn").style.display = "block";
      document.getElementById(
        "playerturn"
      ).innerHTML = `Turn of ${players[playerTurn].name} ${SYMBOLS[playerTurn]}`;
    }
}