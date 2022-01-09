import { GRID_SIZE, WORLD_LENGTH } from "./constants";
import { SnakeGameState } from "./gameState";
import { Position } from "./types";

export function createSnakePart() {
  const snakePart = document.createElement("div");
  snakePart.style.width = `${GRID_SIZE}px`;
  snakePart.style.height = `${GRID_SIZE}px`;
  snakePart.className = "snake";

  return snakePart;
}

export function createFruit() {
  const fruit = document.createElement("div");
  fruit.style.width = `${GRID_SIZE}px`;
  fruit.style.height = `${GRID_SIZE}px`;
  fruit.style.background = "red";
  fruit.style.position = "absolute";
  fruit.style.display = "none";

  return fruit;
}

export function render(preRenderedElements: {
  gameWorldElement: HTMLElement;
  scoreElement: HTMLElement;
}) {
  const { gameWorldElement, scoreElement } = preRenderedElements;

  gameWorldElement.style.height = `${WORLD_LENGTH * GRID_SIZE}px`;
  gameWorldElement.style.width = `${WORLD_LENGTH * GRID_SIZE}px`;
  gameWorldElement.innerHTML = "";

  let renderedSnakeParts: ReturnType<typeof createSnakePart>[] = [];

  const fruit = createFruit();
  gameWorldElement.append(fruit);

  const gameOverText = document.createElement("h1");
  gameOverText.innerText = "GAME OVER";
  gameWorldElement.append(gameOverText);

  function updateSnakeParts(snakeState: Position[]) {
    // snake has grown!
    for (let i = renderedSnakeParts.length; i < snakeState.length; i += 1) {
      const snakePart = createSnakePart();
      renderedSnakeParts.push(snakePart);
      gameWorldElement.append(snakePart);
    }

    for (let i = 0; i < renderedSnakeParts.length; i += 1) {
      const snakePart = renderedSnakeParts[i];
      const currPos = snakeState[i];

      snakePart.style.bottom = currPos.y * GRID_SIZE + "px";
      snakePart.style.left = currPos.x * GRID_SIZE + "px";
    }
  }

  function updateScore(scoreState: number) {
    scoreElement.innerText = scoreState + "";
  }

  function updateGameOverText(isGameOver: boolean) {
    if (isGameOver) {
      gameOverText.style.display = "block";
    } else {
      gameOverText.style.display = "none";
    }
  }

  function updateFruit(fruitState: Position | null | undefined) {
    if (fruitState) {
      fruit.style.display = "block";
      fruit.style.bottom = fruitState.y * GRID_SIZE + "px";
      fruit.style.left = fruitState.x * GRID_SIZE + "px";
    } else {
      fruit.style.display = "none";
    }
  }

  return {
    updateSnakeParts,
    updateFruit,
    updateScore,
    updateGameOverText,
  };
}
