/* eslint no-unused-expressions: "off" */
const path = require('path');
const chai = require('chai');
const expect = chai.expect; 
const modulePath = path.join(__dirname, '../src/connectmoji.js');
const c = require(modulePath);
console.log(modulePath);


describe('connectmoji', function() {
    describe('generateBoard', function() {
        // TODO: write test for version with default " " value
        it('generates a board with specified number of rows and columns with default value of null', function() {
            const board = c.generateBoard(2, 3);
            const expected = { 
              data: [null, null, null, null, null, null],
              rows: 2,
              cols: 3
            };
            expect(board).to.deep.equal(expected);
        });
        it('generates a board with specified number of rows, columns, and fill value', function() {
            const board = c.generateBoard(2, 3, false);
            const expected = { 
              data: [false, false, false, false, false, false],
              rows: 2,
              cols: 3
            };
            expect(board).to.deep.equal(expected);
        });
    });

    describe('rowColToIndex', function() {
        it('translates a row and column to an index', function() {
            const board = c.generateBoard(3, 3);
            const i = c.rowColToIndex(board, 1, 1);
            const j = c.rowColToIndex(board, 0, 2);
            expect(i).to.equal(4);
            expect(j).to.equal(2);
        });
    });

    describe('indexToRowCol', function() {
        it('translates an index to a row and col (as an object)', function() {
            const board = c.generateBoard(3, 3);
            const rowCol1 = c.indexToRowCol(board, 4);
            const rowCol2 = c.indexToRowCol(board, 2);
            expect(rowCol1).to.deep.equal({"row": 1, "col": 1});
            expect(rowCol2).to.deep.equal({"row": 0, "col": 2});
        });
    });

    describe('setCell', function() {
        it('sets the cell to the value specified by row and col', function() {
            let board = c.generateBoard(2, 3, ' ');
            board = c.setCell(board, 1, 1, 'X');
            board = c.setCell(board, 0, 2, 'O');
            expect(board).to.deep.equal({
              data: [' ', ' ', 'O', ' ', 'X', ' '],
              rows: 2,
              cols: 3
            });
        });

        it('does not mutate original board passed in', function() {
            const board = c.generateBoard(2, 3, ' ');
            const updatedBoard = c.setCell(board, 1, 1, 'X');
            expect(updatedBoard).to.deep.equal({
              data: [' ', ' ', ' ', ' ', 'X', ' '],
              rows: 2,
              cols: 3
            });
            expect(board).to.deep.equal({
              data: [' ', ' ', ' ', ' ', ' ', ' '],
              rows: 2,
              cols: 3
            });
        });
    });

    describe('setCells', function() {
        it('places multiple values on board', function() {
            const board = c.generateBoard(3, 3, ' ');
            const updatedBoard = c.setCells(
              board,
              {row:0, col:1, val: 'X'},
              {row:1, col:2, val: 'X'},
              {row:2, col:2, val: 'O'}
            );

            expect(updatedBoard).to.deep.equal({
              data: [' ', 'X', ' ', ' ', ' ', 'X', ' ', ' ', 'O'],
              rows: 3,
              cols: 3
            });
        });

        it('does not mutate original board', function() {
            const board = c.generateBoard(3, 3, ' ');
            c.setCells(
              board,
              {row:0, col:1, val: 'X'},
              {row:1, col:2, val: 'X'},
              {row:2, col:2, val: 'O'}
            );

            expect(board).to.deep.equal({
              data: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
              rows: 3,
              cols: 3
            });
        });
    });


    describe('boardToString', function() {
        it('creates string version of board', function() {
            let board = c.generateBoard(6, 7);
            board = c.setCells(
              board,
              {row: 0, col: 1, val: 'X️' },
              {row: 0, col: 2, val: 'X'},
              {row: 1, col: 0, val: 'D'}
            );
            const expected = `|    | C️ | X  |    |    |    |    |
| D  |    |    |    |    |    |    |
|    |    |    |    |    |    |    |
|    |    |    |    |    |    |    |
|    |    |    |    |    |    |    |
|    |    |    |    |    |    |    |
|----+----+----+----+----+----+----|
| A  | B  | C  | D  | E  | F  | G  |`;
            expect(c.boardToString(board)).to.equal(expected);
        });
        it('creates string version of board that adjusts column width based on contained values', function() {
            let board = c.generateBoard(6, 7);
            board = c.setCells(
              board,
              {row: 0, col: 1, val: 'X'},
              {row: 0, col: 2, val: 'X'},
              {row: 1, col: 0, val: 'O'}
            );
            const expected = `|   | X | X |   |   |   |   |
| O |   |   |   |   |   |   |
|   |   |   |   |   |   |   |
|   |   |   |   |   |   |   |
|   |   |   |   |   |   |   |
|   |   |   |   |   |   |   |
|---+---+---+---+---+---+---|
| A | B | C | D | E | F | G |`;
            expect(c.boardToString(board)).to.equal(expected);
        });
    });

    describe('letterToCol', function() {
        it('translates a letter to a column value (A = 0, B = 1)', function() {
            expect(c.letterToCol("A")).to.equal(0);
            expect(c.letterToCol("Z")).to.equal(25);
        });

        it('returns null if the notation does not contain an uppercase letter', function() {
            expect(c.letterToCol("1")).to.be.null;
            expect(c.letterToCol("a")).to.be.null;
            expect(c.letterToCol("😄")).to.be.null;
        });

        it('returns null if the notation is more than one character', function() {
            expect(c.letterToCol("AB")).to.be.null;
        });
    });

    describe('getEmptyRowCol', function() {
        it('gives back an empty row col with row number less than lowest occupied row number in column', function() {
            let board = c.generateBoard(3, 2);
            board = c.setCells(
              board,
              {row: 2, col: 0, val: '😄'},
              {row: 2, col: 1, val: '😄'},
              {row: 1, col: 1, val: '😄'}
            );
            expect(c.getEmptyRowCol(board, "A")).to.deep.equal({row: 1, col: 0});
            expect(c.getEmptyRowCol(board, "B")).to.deep.equal({row: 0, col: 1});
        });

        it('gives row col with row being highest row number if column is empty', function() {
            const board = c.generateBoard(3, 2);
            expect(c.getEmptyRowCol(board, "A")).to.deep.equal({row: 2, col: 0});
        });

        it('gives back null if column is full', function() {
            let board = c.generateBoard(2, 2);
            board = c.setCells(
              board,
              {row: 1, col: 0, val: '😄'},
              {row: 1, col: 1, val: '😄'},
              {row: 0, col: 0, val: '😄'},
              {row: 0, col: 1, val: '😄'}
            );
            expect(c.getEmptyRowCol(board, "A")).to.be.null;
        });

        it('does not fill holes in columns', function() {
            let board = c.generateBoard(4, 3);
            board = c.setCells(
              board,
              {row: 3, col: 0, val: '😄'},
              {row: 1, col: 0, val: '😄'}
            );
            expect(c.getEmptyRowCol(board, "A")).to.deep.equal({row: 0, col: 0});
        });

        it('does not fill holes in columns even if min row num is filled', function() {
            let board = c.generateBoard(4, 3);
            board = c.setCells(
              board,
              {row: 0, col: 0, val: '😄'}
            );
            expect(c.getEmptyRowCol(board, "A")).to.be.null;
        });

        it('gives back null if column does not exist', function() {
            const board = c.generateBoard(2, 2);
            expect(c.getEmptyRowCol(board, "C")).to.be.null;
        });

        it('gives back null if column is invalid - not a letter or more than 1 character', function() {
            const board = c.generateBoard(2, 2);
            expect(c.getEmptyRowCol(board, "1")).to.be.null;
            expect(c.getEmptyRowCol(board, "AA")).to.be.null;
        });
    });

    describe('getAvailableColumns', function() {
        before(function() {
            function dropPiece(board, val, letter) {
                const nextEmptyCell = c.getEmptyRowCol(board, letter);
                if(nextEmptyCell !== null) {
                    const {row, col} = nextEmptyCell;
                    return c.setCell(board, row, col, val);
                } else {
                    return null;
                }
            }
            if(c.dropPiece === undefined) {
                c.dropPiece = dropPiece;
            }
        });

        it('gives back all column letters that can be used as a valid move (for dropPiece, for example)', function() {
            let board = c.generateBoard(3, 4);

            board = c.dropPiece(board, '😄', 'A');
            board = c.dropPiece(board, '🤮', 'A');
            board = c.dropPiece(board, '😄', 'A');
            board = c.dropPiece(board, '🤮', 'B');
            board = c.dropPiece(board, '😄', 'B');
            board = c.dropPiece(board, '🤮', 'C');
            expect(c.getAvailableColumns(board)).to.have.members(['B', 'C', 'D']);

        });

        it('gives back an empty list of no legal moves can be played)', function() {
            let board = c.generateBoard(3, 3);

            board = c.dropPiece(board, '😄', 'A');
            board = c.dropPiece(board, '🤮', 'A');
            board = c.dropPiece(board, '😄', 'A');
            board = c.dropPiece(board, '🤮', 'B');
            board = c.dropPiece(board, '😄', 'B');
            board = c.dropPiece(board, '🤮', 'B');
            board = c.dropPiece(board, '😄', 'C');
            board = c.dropPiece(board, '🤮', 'C');
            board = c.dropPiece(board, '😄', 'C');
            expect(c.getAvailableColumns(board)).to.be.empty;

        });
    });


    describe('hasConsecutiveValues', function() {
        it('determines if value at location is repeated x times vertically', function() {
            const board = c.generateBoard(3, 4);
            const updatedBoard = c.setCells(
              board,
              {row:2, col:1, val: '😄'},
              {row:1, col:1, val: '😄'},
              {row:0, col:1, val: '😄'}
            );

            expect(c.hasConsecutiveValues(updatedBoard, 2, 1, 3)).to.be.true;
            // (yes, the following wouldn't be possible in-game)
            expect(c.hasConsecutiveValues(updatedBoard, 1, 1, 3)).to.be.true;
            expect(c.hasConsecutiveValues(updatedBoard, 0, 1, 3)).to.be.true;
        });

        it('determines if value at location is repeated x times horizontally', function() {
            const board = c.generateBoard(3, 4, ' ');
            const updatedBoard = c.setCells(
              board,
              {row:2, col:2, val: '😄'},
              {row:2, col:1, val: '😄'},
              {row:2, col:0, val: '😄'}
            );

            expect(c.hasConsecutiveValues(updatedBoard, 2, 2, 3)).to.be.true;
            expect(c.hasConsecutiveValues(updatedBoard, 2, 1, 3)).to.be.true;
            expect(c.hasConsecutiveValues(updatedBoard, 2, 0, 3)).to.be.true;
        });

        it('determines if value at location is repeated x times diagonally', function() {
            const board = c.generateBoard(3, 4, ' ');
            const updatedBoard = c.setCells(
              board,
              {row:2, col:2, val: '😄'},
              {row:2, col:1, val: '🤮'},
              {row:1, col:1, val: '😄'},
              {row:2, col:0, val: '🤮'},
              {row:1, col:0, val: '🤮'},
              {row:0, col:0, val: '😄'}
            );

            expect(c.hasConsecutiveValues(updatedBoard, 2, 2, 3)).to.be.true;
            expect(c.hasConsecutiveValues(updatedBoard, 1, 1, 3)).to.be.true;
            expect(c.hasConsecutiveValues(updatedBoard, 0, 0, 3)).to.be.true;
        });

        it('gives back false if value at location is not repeated x times', function() {
            const board = c.generateBoard(3, 4, ' ');
            const updatedBoard = c.setCells(
              board,
              {row:2, col:2, val: '😄'},
              {row:2, col:1, val: '🤮'},
              {row:1, col:1, val: '🤮'},
              {row:2, col:0, val: '🤮'},
              {row:1, col:0, val: '🤮'},
              {row:0, col:0, val: '😄'}
            );

            expect(c.hasConsecutiveValues(updatedBoard, 2, 2, 3)).to.be.false;
            expect(c.hasConsecutiveValues(updatedBoard, 2, 1, 3)).to.be.false;
            expect(c.hasConsecutiveValues(updatedBoard, 1, 1, 3)).to.be.false;
            expect(c.hasConsecutiveValues(updatedBoard, 2, 0, 3)).to.be.false;
            expect(c.hasConsecutiveValues(updatedBoard, 1, 0, 3)).to.be.false;
            expect(c.hasConsecutiveValues(updatedBoard, 0, 0, 3)).to.be.false;
        });
    });

    describe('autoplay', function() {
        it('autoplays a series of moves based on string', function() {
            const s = '😄🤮ABAACD';

            const board = c.generateBoard(3, 4, null);

            const result = c.autoplay(board, s, 4);
            console.log(result);
            expect(result).to.deep.equal({
              board: {
                data: ['🤮', null, null, null, '😄', null, null, null, '😄', '🤮', '😄', '🤮'],
                rows: 3,
                cols: 4,
              },
              pieces: ['😄', '🤮'],
              lastPieceMoved: '🤮',
              // no winner key!
              // no error key!
            });
        });
        it('autoplays a series of moves based on string and shows winner if last move wins game', function() {
            const s = '😄🤮AABBCCD';

            const board = c.generateBoard(3, 4);

            const result = c.autoplay(board, s, 4);
            expect(result).to.deep.equal({
              board: {
                data: [null, null, null, null, '🤮', '🤮', '🤮', null, '😄', '😄', '😄', '😄'],
                rows: 3,
                cols: 4,
              },
              pieces: ['😄', '🤮'],
              lastPieceMoved: '😄',
              winner: '😄',
              // no error key!
            });
        });


        it('gives back null board property if autoplayed moves result in a win, but there are more moves after win ', function() {
            const s = '😄🤮AABBCCDD';

            const board = c.generateBoard(3, 4);

            const result = c.autoplay(board, s, 4);
            expect(result).to.deep.equal({
              board: null,
              pieces: ['😄', '🤮'],
              lastPieceMoved: '🤮',
              error: {num: 8, val: '🤮', col: 'D'},
            });
        });

        it('gives back null board property if autoplayed moves result in an invalid move', function() {
            const s = '😄🤮D';

            const board = c.generateBoard(3, 3);

            const result = c.autoplay(board, s, 4);
            expect(result).to.deep.equal({
              board: null,
              pieces: ['😄', '🤮'],
              lastPieceMoved: '😄',
              error: {num: 1, val: '😄', col: 'D'},
            });
        });
    });

});
