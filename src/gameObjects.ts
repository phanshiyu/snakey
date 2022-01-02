import { GRID_SIZE, WORLD_LENGTH } from "./constants";
import { SnakeGameState } from "./gameState";

export function createSnakePart(i: number) {
  const snakePart = document.createElement("div");
  snakePart.style.width = `${GRID_SIZE}px`;
  snakePart.style.height = `${GRID_SIZE}px`;
  snakePart.className = "snake";

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

export function render(
  gameState: SnakeGameState,
  preRenderedElements: {
    gameWorldElement: HTMLElement;
    scoreElement: HTMLElement;
  }
) {
  const { gameWorldElement, scoreElement } = preRenderedElements;

  gameWorldElement.style.height = `${WORLD_LENGTH * GRID_SIZE}px`;
  gameWorldElement.style.width = `${WORLD_LENGTH * GRID_SIZE}px`;
  gameWorldElement.innerHTML = "";

  let renderedSnakeParts: ReturnType<typeof createSnakePart>[] = [];

  gameState.subscribe((state) => {
    // snake has grown!
    for (let i = renderedSnakeParts.length; i < state.snake.length; i += 1) {
      const snakePart = createSnakePart(i);
      renderedSnakeParts.push(snakePart);
      gameWorldElement.append(snakePart);
    }

    for (let i = 0; i < renderedSnakeParts.length; i += 1) {
      const snakePart = renderedSnakeParts[i];
      const currPos = state.snake[i];

      snakePart.style.bottom = currPos.y * GRID_SIZE + "px";
      snakePart.style.left = currPos.x * GRID_SIZE + "px";
    }

    // Update score
    scoreElement.innerText = state.score + "";

    if (state.isGameOver) {
      if (!document.getElementById("game-over")) {
        const gameOverText = document.createElement("h1");
        gameOverText.id = "game-over";
        gameOverText.innerText = "GAME OVER";
        gameWorldElement.append(gameOverText);
      }
    }
  });

  gameWorldElement.append(createFruit(gameState));
}
