const clear = require('clear');
const gameBoard = require('./connectmoji.js');
const readlineSync = require('readline-sync');

if (process.argv.length > 2) {
    const parts = process.argv[2].split(',');
    const player = parts[0];
    const moveString = parts[1];
    const moveStringArray = [...moveString];
    const computer = moveStringArray[1];
    const rows = parseInt(parts[2]);
    const cols = parseInt(parts[3]);
    const consecutivePiecesNeeded = parseInt(parts[4]);
    let board = gameBoard.generateBoard(rows, cols);
    const gameResult = gameBoard.autoplay(board, moveString, consecutivePiecesNeeded);

    clear();
    const message = readlineSync.question('\n\nAutoplay is finished...\n\nPlease press ENTER to continue!');
    if (gameResult.hasOwnProperty('error')) {
        console.log('\nAn error has occurred. So sad 😭.');
    } else if (gameResult.hasOwnProperty('winner')) {
        console.log('\nThe winner is: ' + gameResult.winner);
        console.log(gameBoard.boardToString(gameResult.board));
    } else {
        console.log('\nThe game will continue with manual play.');

        let currentPlayer = gameResult.lastPieceMoved;

        if (currentPlayer === player) {
            currentPlayer = computer;
        } else {
            currentPlayer = player;
        }

        console.log('\nIt is the  ' + currentPlayer + 's turn.');

        let whoseTurn = currentPlayer;
        console.log("\n\n");
        const start = readlineSync.question('Press <ENTER> to continue:');
        console.log(gameBoard.boardToString(gameResult.board));
        board = gameResult.board;

        gameBoard.playGame(board, whoseTurn, player, computer, consecutivePiecesNeeded);
    }
}
else {
        let rows;
        let cols;
        let consecutivePiecesNeeded;

        clear();
        const basicGameInfo = readlineSync.question(`\n\nEnter the number of rows, columns, and consecutive "pieces" for win all separated by commas...for example: 6,7,4\n> `);
        const info = basicGameInfo.split(',');
        if (info.length < 3) {
            console.log('\n\nNo args entered, using default: ', 6, 7, 4);
            rows = 6;
            cols = 7;
            consecutivePiecesNeeded = 4;
        } else {
            rows = parseInt(info[0]);
            cols = parseInt(info[1]);
            consecutivePiecesNeeded = parseInt(info[2]);
            console.log('\n\nUsing rows, col and specified consecutive number of pieces: ', rows, cols, consecutivePiecesNeeded);
        }

        const getEmojis = readlineSync.question(`\n\nEnter two characters or emojis that represent the player and computer (separated by a comma... for example: P,C)\n> `);
        let player, computer;
        if (getEmojis.length === 0) { //user doesn't specify, use default
            player = '😎';
            computer = '💻';
            console.log("\n\nNo selections were specified.\nUsing the default game pieces: " + player + "," + computer);
        } else if (getEmojis.length === 1) { //only 1 character is specified
            const emojiArray = getEmojis.split(',');
            player = emojiArray[0];
            computer = '😜';
            console.log("\n\nOnly one piece was specified.\nUsing your selection for the player, and the default piece for the computer: " + player + "," + computer);
        } else {
            const emojiArray = getEmojis.split(',');
            player = emojiArray[0];
            computer = emojiArray[1];
            console.log('\n\nUsing player and computer characters:', player, computer);
        }

        let whoseTurn;
        const firstMove = readlineSync.question(`\n\nWho goes first 🤷 ???\nEnter 'P' for player, or 'C' for computer.\n> `);
        if (firstMove.length === 0) {
            console.log("\nNo selection was made! Player will go first by default.");
        } else if ((firstMove !== 'P' && firstMove !== 'C')) {
            console.log("\nInvalid choice 🤨! Player goes first by default.");
            whoseTurn = player;
        } else if (firstMove === 'P') {
            console.log("\nPlayer takes the first turn 🤩.");
            whoseTurn = player;
        } else {
            console.log("\nComputer takes the first turn ☺️.");
            whoseTurn = computer;
        }

        const start = readlineSync.question('Press <ENTER> to start game');
        const board = gameBoard.generateBoard(rows, cols);
        console.log(gameBoard.boardToString(board));

        gameBoard.playGame(board, whoseTurn, player, computer, consecutivePiecesNeeded);
    }