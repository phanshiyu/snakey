import { GRID_SIZE, WORLD_LENGTH } from "./constants";
import { SnakeGameState } from "./gameState";

export function createSnakePart(gameState: SnakeGameState, i: number) {
  const snakePart = document.createElement("div");
  snakePart.style.width = `${GRID_SIZE}px`;
  snakePart.style.height = `${GRID_SIZE}px`;
  snakePart.className = "snake";

  gameState.subscribe((state) => {
    const currPos = state.snake[i];
    snakePart.style.bottom = currPos.y * GRID_SIZE + "px";
    snakePart.style.left = currPos.x * GRID_SIZE + "px";
  });

  return snakePart;
}

export function createFruit(gameState: SnakeGameState) {
  const fruit = document.createElement("div");
  fruit.style.width = `${GRID_SIZE}px`;
  fruit.style.height = `${GRID_SIZE}px`;
  fruit.style.background = "red";
  fruit.style.position = "absolute";
  fruit.style.display = "none";

  gameState.subscribe((state) => {
    if (state.fruit) {
      fruit.style.display = "block";
      fruit.style.bottom = state.fruit.y * GRID_SIZE + "px";
      fruit.style.left = state.fruit.x * GRID_SIZE + "px";
    } else {
      fruit.style.display = "none";
    }
  });

  return fruit;
}

export function render(gameState: SnakeGameState) {
  // reset
  const gameWorld = document.getElementById("game-world");
  gameWorld.style.height = `${WORLD_LENGTH * GRID_SIZE}px`;
  gameWorld.style.width = `${WORLD_LENGTH * GRID_SIZE}px`;
  gameWorld.innerHTML = "";

  let renderedSnakePartsCount = 0;

  gameState.subscribe((state) => {
    // snake has grown!
    while (renderedSnakePartsCount < state.snake.length) {
      const snakePart = createSnakePart(gameState, renderedSnakePartsCount);
      gameWorld.append(snakePart);

      renderedSnakePartsCount += 1;
    }

    // Update score
    document.getElementById("score").innerText = state.score + "";

    if (state.isGameOver) {
      if (!document.getElementById("game-over")) {
        const gameOverText = document.createElement("h1");
        gameOverText.id = "game-over";
        gameOverText.innerText = "GAME OVER";
        gameWorld.append(gameOverText);
      }
    }
  });

  gameWorld.append(createFruit(gameState));
}
