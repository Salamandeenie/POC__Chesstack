    // The selected Game Piece
    let selectedGamePiece = null;


    // Quite possibly the most important piece to this mess. This keeps track of the filled slots.
    var BoardData = [];

    // This is the holder for the next BoardData update. This allows for that stacking, and ownership to work.
    var BoardUpdateData = [];
    
    // The boundary of the board, in the format Max X, Max Y. Default is [4, maxX]
    var BoardLimit = [7, 7]; 

    // This two keep track whose turn it is
    var turnTracker = 0;
    var turnToColor = ["Blue", "Orange"]
