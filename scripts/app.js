//Imports
import { multipliers } from "./multipliers.js"
import {allBalls} from "./balls.js"

//Elements selectors
const ballsHolder = document.querySelector('.balls-holder')
const numbers = document.querySelector('.numbers')
const colorsElement = document.querySelector('.colors')
const ticketElement = document.querySelector('.ticket')
const clearSelectionBtn = document.querySelector('#clear-button')
const randomNumbersPick = document.querySelector('#random-pick')


//consts and variables

const ticket = [];
const ticketLength = 6;

//HTML generate
multipliers.forEach((multiplier,index)=>{
     let el = `
    <div class= 'ball'>
    <img data-index = ${index + 6} src = 'Images/Basic.png' alt =''/>
    <span>x${multiplier}</span>
    
    </div>`
    ballsHolder.innerHTML += el;
})

allBalls.forEach(ball=>{
    let el = `
    <div class='number' data-index="${ball.number}" data-color=${ball.color}  >${ball.number}</div>
    `
    numbers.innerHTML+= el;
})

const colors=[]
allBalls.forEach(ball=>{
    if(!colors.includes(ball.color)){
        colors.push(ball.color)
    }
})

colors.forEach(color=>{
    let el = `
        <div style='background-color: ${color}' class= 'color' ></div> 
    `
    colorsElement.innerHTML+=el
})

//ticket selection
const selectionNumbers = document.querySelectorAll('.number')

function selectNumbers(e){
    if(ticket.length < ticketLength){
        ticket.push(parseInt(e.target.innerHTML))
        let liElement = document.createElement('li')
        liElement.innerHTML= e.target.innerHTML
        ticketElement.appendChild(liElement)
        e.target.classList.add(e.target.dataset.color)
      
    }
    
    
}
function randomSelection(){
    
    clearSelection();
    for(let i=0; i<ticketLength;i++){
    let randomSelection;
    let selectedIndex =Math.floor(Math.random()*selectionNumbers.length);
    let selectedNumber =selectionNumbers[selectedIndex]
    ticket.push(selectedNumber.innerHTML)
    let liElement = document.createElement('li')
        liElement.innerHTML= selectedNumber.innerHTML
        ticketElement.appendChild(liElement)
        selectedNumber.classList.add(selectedNumber.dataset.color)
    }

}

function clearSelection(){
    ticket.splice(0,ticket.length)
    selectionNumbers.forEach(num=> num.classList.remove(num.dataset.color))
    ticketElement.innerHTML= ''

}



//Event listeners
selectionNumbers.forEach(num=>{
    num.addEventListener('click',selectNumbers)

})
clearSelectionBtn.addEventListener('click',clearSelection)
randomNumbersPick.addEventListener('click',randomSelection)





