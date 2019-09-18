const readlineSync = require('readline-sync');
const wcwidth = require('wcwidth');
const clear = require('clear');

function generateBoard(rows, cols, fill) {
    let internalArray = null;
    if (fill === undefined) {
        internalArray = new Array(rows * cols).fill(null);
    }
    else {
       internalArray = new Array(rows * cols).fill(fill);
    }
    return {
        data: internalArray,
        rows: rows,
        cols: cols
    };
}

function rowColToIndex(board, row, col) {
    let square = -1;
    for (let r = 0; r < board.rows; r++) {
        for (let c = 0; c < board.cols; c++) {
            square++;
            if (r === row && c === col) {
                return square;
            }
        }
    }
    return square;
}

function indexToRowCol(board, i) {
    const saveRow = board.rows;
    return {
        row: Math.floor(i / saveRow),
        col: (i % saveRow)
    };
}

function setCell(board, row, col, value) {
    const trueIndex = rowColToIndex(board, row, col); //get index
    const newBoardArray = board.data.slice();
    newBoardArray[trueIndex] = value;
    return {
        data: newBoardArray,
        rows: board.rows,
        cols: board.cols
    };
}

function setCells(board, ...args) {
    if (args.length === 0) {
        return null;
    }
    let newBoard = setCell(board, args[0].row, args[0].col, args[0].val);
    for (let i = 1; i < args.length; i++) {
        newBoard = setCell(newBoard, args[i].row, args[i].col, args[i].val);
    }
    return newBoard;
}

function nextCharacter(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function getNumberOfMinuses(widestEmoji) {
    let answerString = "--";
    while (widestEmoji > 0) {
        answerString += "-";
        widestEmoji--;
    }
    return answerString;
}

function boardToString(board) {
    const row = board.rows;
    const col = board.cols;
    let widestEmoji = 0;
    for (let i = 0; i < board.data.length; i++) {
        if (wcwidth(board.data[i]) > widestEmoji) {
            widestEmoji = wcwidth(board.data[i]);
        }
    }
    const maxSpaces = widestEmoji + 2;
    let character = 'A';
    let answerString = "";

    function getNumberOfSpaces(num) {
        let answerString = "";
        while (num > 0) {
            answerString += " ";
            num--;
        }
        return answerString;
    }

    for (let r = 0; r < row; r++) {
        for (let c = 0; c < col; c++) {
            let emoji = board.data[rowColToIndex(board, r, c)];
            if (emoji === undefined || emoji === null) {
                emoji = getNumberOfSpaces(widestEmoji);
                answerString += ("| " + emoji + " ");
            }
            else if (wcwidth('emoji') !== widestEmoji) {
                const spacesNeeded = maxSpaces - 1 - wcwidth(emoji);
                answerString += ("| " + emoji + getNumberOfSpaces(spacesNeeded));
            }
            else {
                answerString += ("| " + emoji + " ");
            }
        }
        answerString += ("|\n");
    }

    answerString += "|" + getNumberOfMinuses(widestEmoji);
    for (let i = 1; i < col; i++) {
        answerString += "+" + getNumberOfMinuses(widestEmoji);
    }
    answerString += "|\n";
    for (let j = 0; j < col; j++) {
        answerString += "| " + character + getNumberOfSpaces(widestEmoji);
        character = nextCharacter(character);
    }
    answerString += "|";

    return answerString;
}

function letterToCol(letter) {
    if (letter.length > 1) {
        return null;
    }
    const index = letter.charCodeAt(0) - 'A'.charCodeAt(0);
    return index < 26 && index > -1 ? index : null;
}

// eslint-disable-next-line no-unused-vars
function getEmptyRowCol(board, letter, empty) {
    let answer = null;
    const column = letterToCol(letter);
    if (column === null) {
        return null;
    }
    if (column > board.cols - 1) {
        return null;
    }
    for (let r = board.rows - 1; r >= 0; r--) {
        const currentPosition = rowColToIndex(board, r, column);
        if (board.data[currentPosition] === null) {
            if (r > 0) {
                //fill holes in columns
                if (board.data[rowColToIndex(board, r-1, column)] !== null) {
                    continue;
                }
                //fill holes in columns even if min row num is filled
                for (let top = 0; top < r; top++) {
                    if (board.data[rowColToIndex(board, top, column)] !== null && r-top > 1) {
                        return null;
                    }
                }
            }
            answer = {row: r, col: column};
            break;
        }
    }
    return answer;
}

function getAvailableColumns(board) {
    const answer = [];
    for (let c = 0; c < board.cols; c++) {
        for (let r = 0; r < board.rows; r++) {
            const index = rowColToIndex(board, r, c);
            if (board.data[index] === null) {
                answer.push( ((c + 10).toString(36).toUpperCase()) );
                break;
            }
        }
    }
    return answer;
}

function hasConsecutiveValues(board, row, col, n) {
    const valueSeeking = board.data[rowColToIndex(board, row, col)];
    //check vertical wins
    let vert = n-1;
    for (let r = 1; r < board.rows; r++) {
        if (board.data[rowColToIndex(board, r, col)] === board.data[rowColToIndex(board, r-1, col)] &&
            board.data[rowColToIndex(board, r, col)] === valueSeeking) {
            vert--;
            if (vert === 0) {
                return true;
            }
        }
        else {
            vert = n-1;
        }
    }
    let horiz = n-1;
    //check horizontal wins
    for (let c = 1; c < board.cols; c++) {
        if (board.data[rowColToIndex(board, row, c)] === board.data[rowColToIndex(board, row, c-1)] &&
            board.data[rowColToIndex(board, row, c)] === valueSeeking) {
            horiz--;
            if (horiz === 0) {
                return true;
            }
        }
        else {
            horiz = n-1;
        }
    }
    //diag up - left
    let diagonal1 = n-1;
    let r = row;
    let c = col;
    while (r > 0 && c > 0) {
        if (board.data[rowColToIndex(board, r-1, c-1)] === board.data[rowColToIndex(board, r, c)] &&
            board.data[rowColToIndex(board, r, c)] === valueSeeking) {
            diagonal1--;
            if (diagonal1 === 0) {
                return true;
            }
        }
        else {
            break;
        }
        r--;
        c--;
    }
    //diag down - right
    r = row;
    c = col;
    while (r < board.rows && c < board.cols) {
        if (board.data[rowColToIndex(board, r+1, c+1)] === board.data[rowColToIndex(board, r, c)] &&
            board.data[rowColToIndex(board, r, c)] === valueSeeking) {
            diagonal1--;
            if (diagonal1 === 0) {
                return true;
            }
        }
        else {
            break;
        }
        r++;
        c++;
    }

    //diag up - right
    let diagonal2 = n-1;
    r = row;
    c = col;
    while (r !== 0 && c !== board.cols) {
        if (board.data[rowColToIndex(board, r-1, c+1)] === board.data[rowColToIndex(board, r, c)] &&
            board.data[rowColToIndex(board, r, c)] === valueSeeking) {
            diagonal2--;
            if (diagonal2 === 0) {
                return true;
            }
        }
        else {
            break;
        }
        r--;
        c++;
    }
    //diag down - left
    r = row;
    c = col;
    while (r !== board.rows && c !== 0) {
        if (board.data[rowColToIndex(board, r+1, c-1)] === board.data[rowColToIndex(board, r, c)] &&
            board.data[rowColToIndex(board, r, c)] === valueSeeking) {
            diagonal2--;
            if (diagonal2 === 0) {
                return true;
            }
        }
        else {
            break;
        }
        r++;
        c--;
    }
    return false;
}

function autoplay(board, x, numConsecutive) {
    const s = [...x];
    const player1 = s[0];
    const player2 = s[1];
    let currentPlayer = player1;

    let numberOfMoves = 0;
    let stringIndex = 2;
    let winner = false;
    let nextMove;
    let hasInvalidMove = false;

    function checkForWinner(board, r, c, numConsecutive) {
        if (hasConsecutiveValues(board, r, c, numConsecutive)) {
            return true;
        }
    }

    while (stringIndex < s.length) {
        numberOfMoves++;
        nextMove = getEmptyRowCol(board, s[stringIndex]);
        if (nextMove === null) {
            hasInvalidMove = true;
            break;
        }
        board = setCell(board, nextMove.row, nextMove.col, currentPlayer);
        stringIndex++;
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
        if (checkForWinner(board, nextMove.row, nextMove.col, numConsecutive) === true) {
            winner = true;
            break;
        }
    }

    if (currentPlayer === player1) {
        currentPlayer = player2;
    } else {
        currentPlayer = player1;
    }

    if (hasInvalidMove) {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
        return {
            board: null,
            pieces: [player1, player2],
            lastPieceMoved: currentPlayer,
            error: {num: numberOfMoves, val: currentPlayer, col: s[stringIndex]}
        };
    }
    else if (!winner) { //no winner
        return {
            board: {
                data: board.data,
                rows: board.rows,
                cols: board.cols,
            },
            pieces: [player1, player2],
            lastPieceMoved: currentPlayer,
        };
     } else {
        if (stringIndex < s.length) {
            if (currentPlayer === player1) {
                currentPlayer = player2;
            } else {
                currentPlayer = player1;
            }
            return { //Additional moves after winner
                board: null,
                pieces: [player1, player2],
                lastPieceMoved: currentPlayer,
                error: {num: ++numberOfMoves, val: currentPlayer, col: s[stringIndex]},
            };
        }
        return { //Valid winner
            board: {
                data: board.data,
                rows: board.rows,
                cols: board.cols,
            },
            pieces: [player1, player2],
            lastPieceMoved: currentPlayer,
            winner: currentPlayer,
        };
    }
}

function playGame(board, whoseTurn, player, computer, consecutivePiecesNeeded) {
    let gameOver = false;
    let winner = "NO WINNERS 😱.";

    while (!gameOver) {
        if (whoseTurn === player) {
            let getColLetter = readlineSync.question('\n\nPlease choose a column letter to drop your piece in 😍.\n');
            const availableCols = getAvailableColumns(board);
            if (availableCols.length === 0) { //board full, no winners
                break;
            }
            while (!availableCols.includes(getColLetter)) {
                getColLetter = readlineSync.question('\n\nOops, that is not a valid move, try again! 🥶.\nPlease choose a different column.\n');
            }
            const placement = getEmptyRowCol(board, getColLetter);
            board = setCell(board, placement.row, placement.col, player);
            console.log(boardToString(board));
            if (hasConsecutiveValues(board, placement.row, placement.col, consecutivePiecesNeeded)) {
                gameOver = true;
                winner = player;
                clear();
                break;
            } else {
                whoseTurn = computer;
                clear();
            }
        }
        else {
            console.log('\n\nThe computer will move now ‍💻.');
            const getPossibleCols = getAvailableColumns(board);
            if (getPossibleCols.length === 0) { //board full, no winners
                break;
            }
            const randomNumber = Math.floor(Math.random() * getPossibleCols.length);
            const chosenCol = getPossibleCols[randomNumber];
            console.log('\nThe computer has selected: ' + chosenCol);
            const index = getEmptyRowCol(board, chosenCol);
            board = setCell(board, index.row, index.col, computer);
            console.log(boardToString(board));
            if (hasConsecutiveValues(board, index.row, index.col, consecutivePiecesNeeded)) {
                gameOver = true;
                winner = computer;
                break;
            } else {
                whoseTurn = player;
            }
        }
    }
    console.log("\n\nThe winner is: " + winner + "\n");
    console.log(boardToString(board));
}

module.exports = {
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex,
    indexToRowCol: indexToRowCol,
    setCell: setCell,
    setCells: setCells,
    boardToString: boardToString,
    letterToCol: letterToCol,
    getEmptyRowCol: getEmptyRowCol,
    getAvailableColumns: getAvailableColumns,
    hasConsecutiveValues: hasConsecutiveValues,
    autoplay: autoplay,
    playGame: playGame,
};