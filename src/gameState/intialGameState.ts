import { CONTROL_DIRECTION_MAP, WORLD_LENGTH } from "../constants";
import { Position } from "./types";

// Our starting game state
export const INITIAL_GAME_STATE = Object.freeze({
  // Freeze it to make it read-only
  isGameOver: false,
  score: 0,
  fruit: null,
  snake: initSnake(Math.floor(WORLD_LENGTH / 2)),
  snakeDirection: CONTROL_DIRECTION_MAP.ArrowRight,
});

/**
 * Given the length of the snake, creates a snake horizontally positioned
 * approximately vertically middle of the game world
 * @param length number of snake parts to create
 * @returns
 */
function initSnake(length = 10): Position[] {
  const snake: Position[] = [];

  for (let i = length - 1; i >= 0; i -= 1) {
    snake.push({
      x: i,
      y: Math.floor(WORLD_LENGTH / 2),
    });
  }

  return snake;
}
