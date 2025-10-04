const ballsHolder = document.querySelector('.balls-holder')

for(let i=0; i< 35; i++){
    let dis= `
    <div class= 'ball'>
    <img data-index = ${i + 6} src = 'Images/Basic.png' alt =''/>
    <p>10000</p
    
    </div>`
    ballsHolder.innerHTML += dis
}

