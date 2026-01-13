// Gameboard Module: Handles the data logic of the game board
const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const update = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, update, reset };
})();

// DisplayController Module: Handles DOM manipulation and UI updates
const DisplayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.querySelector('#statusText');
    const restartBtn = document.querySelector('#restartBtn');
    const submitBtn = document.querySelector('#submitBtn');
    const playerInput = document.getElementById('playerInput');

    const render = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const setStatus = (text) => {
        statusText.textContent = text;
    };

    const getPlayerName = () => playerInput.value;
    
    const clearInput = () => {
        playerInput.value = "";
    };

    const setInputPlaceholder = (text) => {
        playerInput.placeholder = text;
    };

    const toggleInput = (show) => {
        const display = show ? "inline-block" : "none";
        playerInput.style.display = display;
        submitBtn.style.display = display;
    };

    const bindEvents = (handlers) => {
        cells.forEach((cell) => {
            cell.addEventListener("click", (e) => {
                const index = e.target.getAttribute("cellIndex");
                handlers.handleCellClick(index);
            });
        });
        restartBtn.addEventListener("click", handlers.handleRestart);
        submitBtn.addEventListener("click", handlers.handleSubmit);
    };

    return { render, setStatus, getPlayerName, clearInput, setInputPlaceholder, toggleInput, bindEvents };
})();

// GameController Module: Controls the game flow
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let running = false;
    
    const winConditions = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    const handleCellClick = (index) => {
        if (!running) return;
        
        const mark = currentPlayerIndex === 0 ? "X" : "O";
        
        if (Gameboard.update(index, mark)) {
            DisplayController.render();
            checkGameStatus(mark);
        }
    };

    const checkGameStatus = (mark) => {
        const board = Gameboard.getBoard();
        const roundWon = winConditions.some(condition => 
            condition.every(index => board[index] === mark)
        );

        if (roundWon) {
            DisplayController.setStatus(`${players[currentPlayerIndex]} wins!`);
            running = false;
        } else if (!board.includes("")) {
            DisplayController.setStatus("Draw!");
            running = false;
        } else {
            currentPlayerIndex = 1 - currentPlayerIndex;
            DisplayController.setStatus(`${players[currentPlayerIndex]}'s turn`);
        }
    };

    const handleSubmit = () => {
        const name = DisplayController.getPlayerName();
        if (name.trim() === "") return;

        players.push(name);
        DisplayController.clearInput();

        if (players.length === 1) {
            DisplayController.setStatus("PLAYER 2 NAME");
            DisplayController.setInputPlaceholder("PLAYER 2 NAME");
        } else {
            DisplayController.toggleInput(false);
            running = true;
            currentPlayerIndex = 0;
            DisplayController.setStatus(`${players[0]}'s turn`);
        }
    };

    const handleRestart = () => {
        Gameboard.reset();
        DisplayController.render();
        players = [];
        running = false;
        currentPlayerIndex = 0;
        DisplayController.setStatus("PLAYER 1 NAME");
        DisplayController.setInputPlaceholder("PLAYER 1 NAME");
        DisplayController.toggleInput(true);
    };

    const init = () => {
        DisplayController.bindEvents({ handleCellClick, handleSubmit, handleRestart });
        DisplayController.setStatus("PLAYER 1 NAME");
    };

    return { init };
})();

GameController.init();
