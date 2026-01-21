// Imports
import { multipliers } from "./multipliers.js";
import { allBalls } from "./balls.js";


function preloadImages() {
  const images = [];
  const basic = new Image();
  basic.src = "images/Basic.png";
  images.push(basic);

  allBalls.forEach(ball => {
    const img = new Image();
    img.src = `images/${ball.image}`;
    images.push(img);
  });

  return images;
}
preloadImages();

// Element selectors
const infoIcon = document.querySelector('.info-icon');
const howToPlayModal = document.querySelector('.modal-how-to-play');
const closeHowToPlayModal = document.querySelector('#close-how-to-play');
const ballsHolder = document.querySelector(".balls-holder");
const numbers = document.querySelector(".numbers");
const colorsElement = document.querySelector(".colors");
const ticketElement = document.querySelector(".ticket");
const clearSelectionBtn = document.querySelector("#clear-button");
const randomNumbersPick = document.querySelector("#random-pick");
const startGameBtn = document.querySelector("#start-game");
const mainBall = document.querySelector(".main-ball");
const modalResultElement = document.querySelector('.modal-result');
const resultElement = document.querySelector('.result');
const amountElement = document.querySelector('.amount');
const setAmountButton = document.querySelector('#set-amount-btn');
const betAmountInput = document.querySelector('#bet-amount');
const resetBtn = document.querySelector('#reset-btn');
const betAmountShow=document.querySelector('.bet-amount-show')

// Variables
const ticket = [];
const ticketLength = 6;
const numbersToDraw = 35;
let drawnNumbers = [];
let winMultiplier = 0;
let amount = parseFloat(localStorage.getItem('amount')) || 10;
let betAmount = 0;

let isDrawing = false;
let drawTimer = null;



// HTML generate
const updateBalanceUI = () => {
  amountElement.innerHTML = `${amount.toFixed(2)}💲`;
  betAmountInput.setAttribute('max', amount.toFixed(2));
  const currentBet = parseFloat(betAmountInput.value);
  if (!isNaN(currentBet) && currentBet > amount) {
    betAmountInput.value = amount.toFixed(2);
  }
};

updateBalanceUI();

multipliers.forEach((multiplier, index) => {
  let el = `
    <div class='ball'>
      <img data-index="${index + 6}" src='images/Basic.png' alt='ball'/>
      <span>x<span>${multiplier}</span></span>
    </div>`;
  ballsHolder.innerHTML += el;
});


allBalls.forEach((ball) => {
  let el = `
    <div class='number' data-index="${ball.number}" data-color="${ball.color}">
      ${ball.number}
    </div>`;
  numbers.innerHTML += el;
});


const colors = [];
allBalls.forEach(ball => { if (!colors.includes(ball.color)) colors.push(ball.color); });
colors.forEach(color => {
  let el = `<div style='background-color: ${color}' class='color'></div>`;
  colorsElement.innerHTML += el;
});

// Ticket selection
const selectionNumbers = document.querySelectorAll(".number");
const pickByColorElements = document.querySelectorAll(".color");
const numberElementByValue = new Map();
selectionNumbers.forEach(num => {
  numberElementByValue.set(parseInt(num.dataset.index), num);
});

function addNumberToTicket(number) {
  if (isDrawing) return false;
  if (ticket.length >= ticketLength) return false;
  if (ticket.includes(number)) return false;
  const el = numberElementByValue.get(number);
  if (!el) return false;

  ticket.push(number);
  const li = document.createElement("li");
  li.innerHTML = number;
  ticketElement.appendChild(li);
  el.classList.add(el.dataset.color);

  if (ticket.length === ticketLength) {
    betAmountInput.removeAttribute("disabled");
    setAmountButton.removeAttribute('disabled');
  }
  return true;
}

function selectNumbers(e) {
  const value = parseInt(e.target.dataset.index || e.target.innerHTML);
  addNumberToTicket(value);
}

function randomSelection() {
  if (isDrawing) return;
  clearSelection();
  const pool = allBalls.map(ball => ball.number);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  pool.slice(0, ticketLength).forEach(num => addNumberToTicket(num));
}

function selectByColor(e) {
  if (isDrawing) return;
  selectionNumbers.forEach(num => {
    if (ticket.length < ticketLength && num.dataset.color === e.target.style.backgroundColor) {
      addNumberToTicket(parseInt(num.dataset.index));
    }
  });
}


// Clear selection
function clearSelection() {
  ticket.splice(0, ticket.length);
  selectionNumbers.forEach(num => num.classList.remove(num.dataset.color));
  ticketElement.textContent = "";
  startGameBtn.setAttribute("disabled", true);
  betAmountShow.textContent = '';
}

//Setting bet amount
function setBetAmount() {
  if (ticket.length !== ticketLength) return;
  betAmount = parseFloat(betAmountInput.value);
  if (!betAmount || betAmount <= 0) return;
  if (betAmount > amount) {
    alert('Bet exceeds available balance.');
    return;
  }
  startGameBtn.removeAttribute('disabled');
  amount -= betAmount;
  updateBalanceUI();
  localStorage.setItem('amount', amount);
  betAmountInput.setAttribute('disabled', true);
  setAmountButton.setAttribute('disabled', true);
  betAmountShow.textContent= `Bet amount: ${betAmount.toFixed(2)}💲`;
  resetBtn.setAttribute('disabled',true);
  randomNumbersPick.setAttribute('disabled',true);
  clearSelectionBtn.setAttribute('disabled',true);
}

const ballElementImages = document.querySelectorAll(".ball img"); 

// Start game 
function startGame() {
  if (isDrawing) return;
  if (!betAmount) return;
  isDrawing = true;
  startGameBtn.setAttribute("disabled", true);

  drawnNumbers = [];
  winMultiplier = 0;
  mainBall.style.opacity = "0";
  mainBall.style.width = "0";
  ballElementImages.forEach(el => el.src = 'images/Basic.png');

  const ticketLiElements = Array.from(ticketElement.querySelectorAll("li"));
  ticketLiElements.forEach(li => li.style.backgroundColor = "");

  let drawCounter = 0;       
  let multiplierCounter = 0;
  let winCounter = 0;

  function drawNext() {
    if (drawCounter >= numbersToDraw) {
      finishDrawing();
      return;
    }

   
    let randomBall;
    let drawnNumber;
    do {
      const randomIndex = Math.floor(Math.random() * allBalls.length);
      randomBall = allBalls[randomIndex];
      drawnNumber = randomBall.number;
    } while (drawnNumbers.includes(drawnNumber));
    drawnNumbers.push(drawnNumber);

    mainBall.src = `images/${randomBall.image}`;
    mainBall.style.opacity = 1;
    mainBall.style.width = "80%";

    if (multiplierCounter < ballElementImages.length) {
      ballElementImages[multiplierCounter].src = `images/${randomBall.image}`;
      multiplierCounter++;
    }

    const matchedLis = ticketLiElements.filter(li => parseInt(li.innerHTML) === drawnNumber);
    if (matchedLis.length) {
      matchedLis.forEach(li => li.style.backgroundColor = "green");
      winCounter += matchedLis.length;
      if (winCounter === 6) winMultiplier = multipliers[drawCounter - 5];
    }

    drawCounter++;

   
    setTimeout(() => {
      mainBall.style.opacity = "0";
      mainBall.style.width = "0";
    }, 1000);

    drawTimer = setTimeout(drawNext, 1500); 
  }

  function finishDrawing() {
    isDrawing = false;
    endGame(winMultiplier);
  }

  drawNext();
}


// End game
function endGame(winMultiplier) {
  if (drawTimer) clearTimeout(drawTimer);
  isDrawing = false;

  const win = betAmount * winMultiplier;
  setTimeout(() => {
    modalResultElement.style.display = 'flex';
    if (winMultiplier) {
      resultElement.innerHTML = `🏆 You win ${win.toFixed(2)}💲`;
      amount += win;
    } else {
      resultElement.innerHTML = 'You lose 😒';
    }
    updateBalanceUI();
    localStorage.setItem('amount', amount);
    clearSelection();
  }, 1000);

  setTimeout(() => {
    modalResultElement.style.display = 'none';
    ballElementImages.forEach(el => el.src = 'images/Basic.png');
    randomNumbersPick.removeAttribute('disabled')
    clearSelectionBtn.removeAttribute('disabled')
    resetBtn.removeAttribute('disabled');
    betAmountInput.removeAttribute('disabled');
    setAmountButton.removeAttribute('disabled');
    betAmountShow.textContent='';
    betAmount = 0;
  }, 3000);
}



function resetGame() {
  if (drawTimer) clearTimeout(drawTimer);
  drawTimer = null;
  isDrawing = false;
  amount = 10;
  updateBalanceUI();
  localStorage.setItem('amount', amount);
  clearSelection();
  betAmountInput.removeAttribute("disabled");
  setAmountButton.removeAttribute("disabled");
  betAmount = 0;
  betAmountShow.textContent = '';
}

// Event listeners
selectionNumbers.forEach(num => num.addEventListener("click", selectNumbers));
clearSelectionBtn.addEventListener("click", clearSelection);
randomNumbersPick.addEventListener("click", randomSelection);
startGameBtn.addEventListener("click", startGame);
pickByColorElements.forEach(el => el.addEventListener("click", selectByColor));
setAmountButton.addEventListener('click', setBetAmount);
resetBtn.addEventListener('click', resetGame);
infoIcon.addEventListener('click', () => howToPlayModal.style.display = 'flex');
closeHowToPlayModal.addEventListener('click', () => howToPlayModal.style.display = 'none');