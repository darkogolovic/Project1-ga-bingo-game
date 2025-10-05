//Imports
import { multipliers } from "./multipliers.js"
import {allBalls} from "./balls.js"

//Elements selectors
const ballsHolder = document.querySelector('.balls-holder')
const numbers = document.querySelector('.numbers')
const colorsElement = document.querySelector('.colors')

//HTML generate
multipliers.forEach((multiplier,index)=>{
     let el = `
    <div class= 'ball'>
    <img data-index = ${index + 6} src = 'Images/Basic.png' alt =''/>
    <span>${multiplier}</span>
    
    </div>`
    ballsHolder.innerHTML += el;
})

allBalls.forEach(ball=>{
    let el = `
    <div class='number'>${ball.number}</div>
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
        <div style='background-color: ${color}' class= 'color'></div> 
    `
    colorsElement.innerHTML+=el
})