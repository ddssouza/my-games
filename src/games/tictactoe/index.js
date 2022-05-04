import React, { Component } from "react";

const click = (event) => console.log("clicked", event);

const cell = (key) => <button className="cell" key={key}></button>;

const grid = (size) => {
  let grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = cell(i + j);
    }
  }

  return grid;
};

const TicTacToe = () => {
  return (
    <div className="grid">
      {grid(3).map((line, i) => (
        <div className="line" key={i}>
          {line}
        </div>
      ))}
    </div>
  );
};

export default TicTacToe;
