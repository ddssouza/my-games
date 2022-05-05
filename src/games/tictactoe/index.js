import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faO, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./TicTacToe.css";

const cols = 5;
const rows = 5;
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
// pra validar: 3 da mesma coluna, 3 da mesma linha ou 1 de cada coluna e linha
const TicTacToe = () => {
  const [currentPlayer, setPlayer] = useState(1);
  const [grid, setGrid] = useState(initialGrid(rows, cols));
  const [isGameOver, setIsGameOver] = useState(false);

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
    setGrid(updatedGrid);
    setIsGameOver(isValid);
    setPlayer(currentPlayer === player1 ? player2 : player1);
  };

  return (
    <div className="wrapper">
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
      {isGameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default TicTacToe;
