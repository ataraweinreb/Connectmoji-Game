# Connectmoji Game  😎 🙄 😜

Created by: [Tara Weinreb](https://www.taraweinreb.com).

## Description
An interactive 2-player (computer vs human player) "connection" game, implementated in JavaScript. 

## Rules
* The game is played on a vertical grid of cells (imagine a board stood on its side).
* Players take alternate turns dropping a piece in a column.
* The piece dropped will occupy the lowest unoccupied cell of the grid.
* When a player drops a piece that results in an uninterrupted vertical, horizontal or diagonal line of adjacent identical pieces of an agreed upon length, that player wins!

## Info
There are 2 fun ways to play:
1. A regular interactive game, human vs. computer
2. Specify scripted moves for both players

## Regular 2-Player Game

The player and the computer will take turns dropping pieces until the board is full or the player and computer have reached the number set for consecutive values. This version will be played when NO commandline args are specified. 

From your root directory run:
```console
node src/game.js
```

## Scripted Moves Game

Why do we need this feature?
Answer: Testing your game against a computer player that makes random moves can be pretty annoying because you can't reliably repeat tests!

To deal with this, I've added a feature that allows you to pass in the game's configuration, as well as a series of moves. That is, when you run your game on the commandline, you can add an extra option to configure the game and control the computer and player moves.

Essentially - type in:
``` console
node src/game.js OPTIONS_AND_MOVES
```
… where OPTIONS_AND_MOVES is in the following format:
``` console
PLAYER_VALUE,MOVE_STRING,NUMBER_ROWS,NUMBER_COLUMNS,NUMBER_CONSECUTIVE
```
EXAMPLE:
For example, the following is a valid string for OPTIONS_AND_MOVES:
``` console
node src/game.js 😎,😎💻AABBCC,6,7,4
```

## Running Tests

Running the tests - from root directory:

```console
npx mocha test/connectmoji.js
```
