const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#statusText');
const restartBtn = document.querySelector('#restartBtn');
const submitBtn = document.querySelector('#submitBtn');
const playerInput = document.getElementById('playerInput')
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
let playerName = []

let options = ["","","","","","","","",""]
let currentPlayer = "";
let mark = "X" 
let running = false;


initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    submitBtn.addEventListener("click", submitHandler);
    statusText.textContent ="PLAYER 1 NAME"
    // statusText.textContent = `${currentPlayer}'s turn`;

}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");
    if(options[cellIndex] != "" || !running){
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index){
    // options[index] = currentPlayer;
    // cell.textContent = currentPlayer;
    if(currentPlayer == playerName[0]){
        mark = "x"
        options[index] = mark
        cell.textContent = mark;
    }else{
        mark = "O"
        options[index] = mark
        cell.textContent = mark;
    }
    
    
}

function changePlayer(){
    currentPlayer = (currentPlayer == playerName[0]) ? playerName[1] : playerName[0];
    statusText.textContent = `${currentPlayer}'s turn`
}
function checkWinner(){
    let roundWon = false;

    for(let i = 0;i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA =  options[condition[0]];
        const cellB =  options[condition[1]];
        const cellC =  options[condition[2]];
        console.log(condition,i)
        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }

        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent =`${currentPlayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        statusText.textContent = 'Draw!';
        running = false;
    }
    else{
        changePlayer();
    }

}
function restartGame(){
    currentPlayer = "X";
    options = ["","","","","","","","",""];
    playerName = [];
    // statusText.textContent = `${currentPlayer}'s turn`;
    statusText.textContent ="PLAYER 1 NAME";
    cells.forEach(cell => cell.textContent ="");
    playerInput.style.display = "inline-block";
    submitBtn.style.display = "inline-block";
    running = false;
}

function submitHandler(){
    playerName.push(playerInput.value);
    playerInput.value = "";
    playerInput.placeholder = "PLAYER 2 NAME";
    statusText.textContent = "PLAYER 2 NAME";
    if(playerName.length == 2){
        playerInput.style.display = "none";
        submitBtn.style.display = "none";
        statusText.textContent = `${playerName[0]}'s turn`
        currentPlayer = playerName[0]
        running = true
    }
    console.log(playerName);
}

