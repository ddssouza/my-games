import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faO, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./TicTacToe.css";

const cols = 3;
const rows = 3;
const player1 = 1;
const player2 = 2;

const initialGrid = (rows, cols) =>
  [...Array(rows)].map((_, row) =>
    [...Array(cols)].map((_, col) => ({
      player: null,
      isWinner: false,
      row,
      col,
    }))
  );

const getPrincipalDiagonal = (grid) => [
  ...new Set(grid.map((row, index) => row[index])),
];

const getReverseDiagonal = (grid) => [
  ...new Set(grid.map((row, index, self) => row[self.length - 1 - index])),
];

const getColumn = (grid, col) => grid.flat().filter((item) => item.col === col);

const validate = (set) =>
  set.every((v, i, self) => v.player !== null && v.player === set[1].player);

const markAsPlayed = (player) => (
  <FontAwesomeIcon icon={player === 1 ? faXmark : faO} />
);

const TicTacToe = () => {
  const [currentPlayer, setPlayer] = useState(1);
  const [grid, setGrid] = useState(initialGrid(rows, cols));
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState({ [player1]: 0, [player2]: 0 });

  const handleUserSelection = ({ row, col }) => {
    let isValid = false;
    let updatedGrid = grid.map((item, i) =>
      item.map((j) =>
        row === j.row && j.col === col
          ? {
              ...j,
              player: currentPlayer,
            }
          : j
      )
    );
    const diag1 = getPrincipalDiagonal(updatedGrid);
    const diag2 = getReverseDiagonal(updatedGrid);
    const column = getColumn(updatedGrid, col);
    let noSquaresLeft = false;

    switch (true) {
      case validate(updatedGrid[row]):
        isValid = true;
        updatedGrid = updatedGrid.map((set, i) =>
          i === row ? set.map((v) => ({ ...v, isWinner: true })) : set
        );
        break;
      case validate(column):
        isValid = true;
        updatedGrid = updatedGrid.map((set) =>
          set.map((v) => (v.col === col ? { ...v, isWinner: true } : v))
        );
        break;
      case validate(diag1):
        isValid = true;
        const items = diag1.reduce(
          (acc, curr) => [...acc, [curr.row, curr.col]],
          []
        );

        updatedGrid = updatedGrid.reduce((acc, curr, i) => {
          acc[i] = curr.map((item) =>
            items.some(([i, j]) => i === item.row && j === item.col)
              ? { ...item, isWinner: true }
              : item
          );
          return acc;
        }, []);
        break;
      case validate(diag2):
        isValid = true;
        const pairs = diag2.reduce(
          (acc, curr) => [...acc, [curr.row, curr.col]],
          []
        );

        updatedGrid = updatedGrid.reduce((acc, curr, i) => {
          acc[i] = curr.map((item) =>
            pairs.some(([i, j]) => i === item.row && j === item.col)
              ? { ...item, isWinner: true }
              : item
          );
          return acc;
        }, []);
        break;
    }
    noSquaresLeft = updatedGrid.every((i) => i.every((j) => j.player !== null));
    setGrid(updatedGrid);
    setIsGameOver(isValid || noSquaresLeft);
    setPlayer(currentPlayer === player1 ? player2 : player1);
    if (isValid) {
      const newScore = score;
      newScore[currentPlayer] = newScore[currentPlayer] + 1;

      setScore(newScore);
    }
  };

  const resetGame = () => {
    setIsGameOver(false);
    setGrid(initialGrid(rows, cols));
  };

  return (
    <div className="wrapper">
      <h2>Tic Tac Toe</h2>
      <div className="grid">
        {grid.map((row, key) => (
          <div className="row" key={key}>
            {row.map((rowInfo) => (
              <button
                key={rowInfo.col + rowInfo.row}
                className={"cell " + (rowInfo.isWinner ? "winner" : "")}
                disabled={!!rowInfo.player}
                onClick={() => !isGameOver && handleUserSelection(rowInfo)}
              >
                {!!rowInfo.player && markAsPlayed(rowInfo.player)}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="scores">
        <div>
          <h4>Player 1</h4>
          <p>{score[1]}</p>
        </div>
        <div>
          <h4>Player 2</h4>
          <p>{score[2]}</p>
        </div>
      </div>
      {isGameOver && <div className="game-over">Game Over!</div>}
      {isGameOver && (
        <button className="reset" onClick={() => resetGame()}>
          Reset
        </button>
      )}
    </div>
  );
};

export default TicTacToe;
