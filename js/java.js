// Game configuration
const gridSize = 10; // 10x10 grid
const mineCount = 15;

// Game state
let grid = [];
let gameOver = false;

// Initialize the game
function initializeGame() {
    const gameContainer = document.getElementById('game');
    const message = document.getElementById('message');
    gameContainer.innerHTML = '';
    message.textContent = '';
    gameOver = false;

    // Create the grid
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill({ isMine: false, revealed: false }));

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        if (!grid[row][col].isMine) {
            grid[row][col] = { isMine: true, revealed: false };
            minesPlaced++;
        }
    }

    // Render the grid
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => revealCell(row, col));
            gameContainer.appendChild(cell);
        }
    }
}

// Reveal a cell
function revealCell(row, col) {
    if (gameOver || grid[row][col].revealed) return;

    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const cellData = grid[row][col];

    cellData.revealed = true;
    cell.classList.add('revealed');

    if (cellData.isMine) {
        cell.classList.add('mine');
        gameOver = true;
        document.getElementById('message').textContent = 'Game Over! You hit a mine!';
        revealAllMines();
    } else {
        const adjacentMines = countAdjacentMines(row, col);
        if (adjacentMines > 0) {
            cell.textContent = adjacentMines;
        } else {
            // Reveal adjacent cells if no mines are nearby
            revealAdjacentCells(row, col);
        }
    }
}

// Count adjacent mines
function countAdjacentMines(row, col) {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                if (grid[newRow][newCol].isMine) count++;
            }
        }
    }
    return count;
}

// Reveal all mines
function revealAllMines() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col].isMine) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell.classList.add('mine');
            }
        }
    }
}

// Reveal adjacent cells recursively
function revealAdjacentCells(row, col) {
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                if (!grid[newRow][newCol].revealed && !grid[newRow][newCol].isMine) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
}

// Start the game on page load
window.onload = initializeGame;
