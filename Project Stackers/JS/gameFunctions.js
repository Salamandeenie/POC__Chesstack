// gameFunctions


// Constructor Functions
{
    // Constructor for GamePiece
    function GamePiece(position, level, owner) {
        this.position = position; // Array [x, y]
        this.level = level;
        this.owner = owner;
    }
}

// Board functions
{
    // this initializes the board.
    function initBoard() {
        createGamePieceRow(BoardLimit[0], [0,0], 1, "Orange");
        createGamePieceRow(BoardLimit[0], [0, BoardLimit[1] -1], 1, "Blue");
    }

    // Function to draw the game board
    function drawGameBoard() {
        const gameBoard = document.getElementById('game-board');
    
        // Clear the existing content
        gameBoard.innerHTML = '';
    
        // Loop through all possible positions on the board
        for (let row = 0; row < BoardLimit[1]; row++) {
            for (let col = 0; col < BoardLimit[0]; col++) {
                const position = [col, row];
    
                // Check if there's a game piece at this position
                const hasGamePiece = BoardData.some(piece => isEqual(piece.position, position));
    
                // Create a div element for the cell
                const cellDiv = document.createElement('div');
                cellDiv.className = 'game-piece';
    
                // If there's a game piece, render it; otherwise, render an empty space
                if (hasGamePiece) {
                    const gamePiece = BoardData.find(piece => isEqual(piece.position, position));
                    cellDiv.style.backgroundColor = gamePiece.owner.toLowerCase();
                    cellDiv.innerText = gamePiece.level;
    
                    // Add click event listener to select/deselect game pieces
                    cellDiv.addEventListener('click', () => toggleSelectGamePiece(gamePiece, cellDiv));
                } else {
                    cellDiv.style.backgroundColor = 'gray'; // Adjust the color for empty spaces
                }
    
                // Set the position using grid column and row
                cellDiv.style.gridColumn = col + 1; // Add 1 because grid starts at 1
                cellDiv.style.gridRow = row + 1; // Add 1 because grid starts at 1
    
                // Append the div to the game board
                gameBoard.appendChild(cellDiv);
            }
        }
    }
    

    // This creates a row of GamePieces and appends it to BoardData
    function createGamePieceRow(Length = BoardLimit[0], startPos = [0, 0], stackHeight = 1, owner) {
        for (let i = 0; i < Length; i++) {
            const position = [startPos[0] + i, startPos[1]];
            const gamePiece = new GamePiece(position, stackHeight, owner);
            BoardData.push(gamePiece); // Push each game piece individually
        }
    }


    // Selects a game piece and defines the direction you want it to go.
    function movePiece(gamePiece, direction) {
        var clonePiece = gamePiece;
        destroyGamePiece(gamePiece);

        let x = clonePiece.position[0];
        let y = clonePiece.position[1];
        
        x = x + (direction[0] * clonePiece.level);
        y = y + (-direction[1] * clonePiece.level);


        let pushedGamePiece = new GamePiece([x,y], clonePiece.level, clonePiece.owner);
        BoardUpdateData.push(pushedGamePiece);
        resolveBoardConflicts();
    }

// Function to resolve conflicts and update positions
function resolveBoardConflicts() {
    for (let i = 0; i < BoardUpdateData.length; i++) {
        const gamePiece = BoardUpdateData[i];

        // Wrap around if x is greater than or equal to board limit
        if (gamePiece.position[0] >= BoardLimit[0]) {
            gamePiece.position[0] = gamePiece.position[0] % BoardLimit[0];
        }

        // Wrap around if x is less than 0
        if (gamePiece.position[0] < 0) {
            gamePiece.position[0] = (gamePiece.position[0] + BoardLimit[0]) % BoardLimit[0];
        }

        // Wrap around if y is greater than or equal to board limit
        if (gamePiece.position[1] >= BoardLimit[1]) {
            gamePiece.position[1] = gamePiece.position[1] % BoardLimit[1];
        }

        // Wrap around if y is less than 0
        if (gamePiece.position[1] < 0) {
            gamePiece.position[1] = (gamePiece.position[1] + BoardLimit[1]) % BoardLimit[1];
        }

        // Check for conflicts with existing pieces in BoardData
        const existingPiece = BoardData.find(piece => isEqual(piece.position, gamePiece.position));

        if (existingPiece) {
            // Resolve conflict - modify gamePiece's information as needed
            gamePiece.level += existingPiece.level; // Adjust levels
            // Optionally, you can do more adjustments based on your requirements

            // Remove the existing piece from BoardData
            destroyGamePiece(existingPiece);
        }

        // Add the resolved gamePiece to BoardData
        BoardData.push(gamePiece);
    }

    // Clear the update array after resolving conflicts
    BoardUpdateData = [];
    drawGameBoard();
}


    // Destroys a given gamePiece
    function destroyGamePiece(gamePiece) {
        // Find the index of the gamePiece in BoardData
        const index = BoardData.findIndex(piece => isEqual(piece.position, gamePiece.position));

        // If found, remove it from the array
        if (index !== -1) {
            BoardData.splice(index, 1);
        }
        else return console.log("Error - Game Object does not exist!");
    }

}

// Array Functions
{
    // Simpple function to check if two arrays are equal
    function isEqual(arr1, arr2) {
        return arr1.every((val, index) => val === arr2[index]);
    }


}

// Button Functions
{
    function toggleSelectGamePiece(gamePiece, cellDiv) {
        if (selectedGamePiece === gamePiece) {
            // Deselect the currently selected game piece
            selectedGamePiece = null;
            cellDiv.style.border = ''; // Remove the black outline
            enableDirectionButtons(false); // Disable direction buttons
        } else {
            // Select a new game piece
            if (selectedGamePiece) {
                // Deselect the previously selected game piece
                const prevSelectedDiv = document.querySelector('.selected');
                if (prevSelectedDiv) {
                    prevSelectedDiv.style.border = '';
                }
            }
    
            selectedGamePiece = gamePiece;
            cellDiv.style.border = '2px solid black'; // Add a black outline
            enableDirectionButtons(true); // Enable direction buttons
        }
    }

    function enableDirectionButtons(enabled) {
        const directionButtons = document.querySelectorAll('#direction-buttons button');
        directionButtons.forEach(button => {
            button.disabled = !enabled;
            button.style.backgroundColor = enabled ? '' : 'lightgray';
        });
    }

    // Function to move the currently selected game piece
    function moveSelectedPiece(direction) {
    if (selectedGamePiece) {
        movePiece(selectedGamePiece, direction);
        selectedGamePiece = null; // Deselect after moving
        drawGameBoard(); // Redraw the board after the move
        enableDirectionButtons(false); // Disable direction buttons after moving
    }
}

        
}
