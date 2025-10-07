//Imports
import { multipliers } from "./multipliers.js";
import { allBalls } from "./balls.js";

//Elements selectors
const ballsHolder = document.querySelector(".balls-holder");
const numbers = document.querySelector(".numbers");
const colorsElement = document.querySelector(".colors");
const ticketElement = document.querySelector(".ticket");
const clearSelectionBtn = document.querySelector("#clear-button");
const randomNumbersPick = document.querySelector("#random-pick");
const startGameBtn = document.querySelector("#start-game");
const mainBall = document.querySelector(".main-ball");

//consts

const ticket = [];
const ticketLength = 6;
const numbersToDraw = 35;
const drawnNumbers = [];

//HTML generate
multipliers.forEach((multiplier, index) => {
  let el = `
    <div class= 'ball'>
    <img data-index = ${index + 6} src = 'Images/Basic.png' alt =''/>
    <span>x${multiplier}</span>
    
    </div>`;
  ballsHolder.innerHTML += el;
});

allBalls.forEach((ball) => {
  let el = `
    <div class='number' data-index="${ball.number}" data-color=${ball.color}  >${ball.number}</div>
    `;
  numbers.innerHTML += el;
});

const colors = [];
allBalls.forEach((ball) => {
  if (!colors.includes(ball.color)) {
    colors.push(ball.color);
  }
});

colors.forEach((color) => {
  let el = `
        <div style='background-color: ${color}' class= 'color' ></div> 
    `;
  colorsElement.innerHTML += el;
});

//ticket selection
const selectionNumbers = document.querySelectorAll(".number");
const pickByColorElements = document.querySelectorAll(".color");

function selectNumbers(e) {
  if (ticket.length < ticketLength) {
    ticket.push(parseInt(e.target.innerHTML));
    let liElement = document.createElement("li");
    liElement.innerHTML = e.target.innerHTML;
    ticketElement.appendChild(liElement);
    e.target.classList.add(e.target.dataset.color);
    if (ticket.length === ticketLength) {
      startGameBtn.removeAttribute("disabled");
    }
  }
}
function randomSelection() {
  clearSelection();
  for (let i = 0; i < ticketLength; i++) {
    let randomSelection;
    let selectedIndex = Math.floor(Math.random() * selectionNumbers.length);
    let selectedNumber = selectionNumbers[selectedIndex];
    ticket.push(selectedNumber.innerHTML);
    let liElement = document.createElement("li");
    liElement.innerHTML = selectedNumber.innerHTML;
    ticketElement.appendChild(liElement);
    selectedNumber.classList.add(selectedNumber.dataset.color);
  }
  startGameBtn.removeAttribute("disabled");
}

function selectByColor(e) {
  selectionNumbers.forEach((num) => {
    if (ticket.length === 0) {
      if (num.dataset.color === e.target.style.backgroundColor) {
        num.classList.add(e.target.style.backgroundColor);
        ticket.push(num.innerHTML);
        let liElement = document.createElement("li");
        liElement.innerHTML = num.innerHTML;
        ticketElement.appendChild(liElement);
        startGameBtn.removeAttribute("disabled");
      }
    } else if (ticket.length > 0 && ticket.length < ticketLength) {
      if (num.dataset.color === e.target.style.backgroundColor) {
        num.classList.add(e.target.style.backgroundColor);
        ticket.push(num.innerHTML);
        let liElement = document.createElement("li");
        liElement.innerHTML = num.innerHTML;
        ticketElement.appendChild(liElement);
        startGameBtn.removeAttribute("disabled");
      }
    }
  });
}

//clear selection
function clearSelection() {
  ticket.splice(0, ticket.length);
  selectionNumbers.forEach((num) => num.classList.remove(num.dataset.color));
  ticketElement.innerHTML = "";
  startGameBtn.setAttribute("disabled", true);
}

//start game
const ballElementImages = document.querySelectorAll(".ball img");

console.log(ballElementImages);

function startGame() {
  const ticketLiElements = document.querySelectorAll(".ticket li");
  let counter = 0;

  startGameBtn.setAttribute("disabled", true);

  let drawing = setInterval(() => {
    mainBall.style.opacity = 1;
    
    let randomBallIndex = Math.floor(Math.random() * allBalls.length);
    let randomBall = allBalls[randomBallIndex];
    let drawnNumber = randomBall.number;
    if (!drawnNumbers.includes(drawnNumber)) {
      drawnNumbers.push(drawnNumber);
      mainBall.setAttribute("src", `images/${randomBall.image}`);
      mainBall.style.width = "80%";
      ballElementImages[counter].src = `/images/${
        randomBall.color.charAt(0).toUpperCase() + randomBall.color.slice(1)
      }-${drawnNumber}.png`;

      ticketLiElements.forEach((li) => {
        if (drawnNumber === parseInt(li.innerHTML)) {
          li.style.backgroundColor = "green";
        }
      });
      counter++;
    }

    setTimeout(() => {
      mainBall.style.opacity = "0";
      mainBall.style.width = "0";
      if (counter === numbersToDraw) {
        clearInterval(drawing);
        endGame();
      }
    }, 600);
  }, 1000);
}

function endGame() {}

//Event listeners
selectionNumbers.forEach((num) => {
  num.addEventListener("click", selectNumbers);
});
clearSelectionBtn.addEventListener("click", clearSelection);
randomNumbersPick.addEventListener("click", randomSelection);
startGameBtn.addEventListener("click", startGame);
pickByColorElements.forEach((el) => {
  el.addEventListener("click", selectByColor);
});
