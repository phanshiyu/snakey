import { GRID_SIZE, WORLD_LENGTH } from "./constants";
import { Fruit, Position } from "./gameState/types";

export function createSnakePart() {
  const snakePart = document.createElement("div");
  snakePart.style.width = `${GRID_SIZE}%`;
  snakePart.style.height = `${GRID_SIZE}%`;
  snakePart.className = "snake";

  return snakePart;
}

export function createFruit() {
  const fruit = document.createElement("div");
  fruit.style.width = `${GRID_SIZE}%`;
  fruit.style.height = `${GRID_SIZE}%`;
  fruit.style.background = "red";
  fruit.style.position = "absolute";
  fruit.style.display = "none";

  return fruit;
}

export function render(preRenderedElements: {
  gameWorldElement: HTMLElement;
  scoreElement: HTMLElement;
  startButtonElement: HTMLElement;
}) {
  const { gameWorldElement, scoreElement, startButtonElement } =
    preRenderedElements;

  gameWorldElement.innerHTML = "";

  let renderedSnakeParts: ReturnType<typeof createSnakePart>[] = [];

  const fruit = createFruit();
  gameWorldElement.append(fruit);

  const gameOverText = document.createElement("h1");
  gameOverText.innerText = "GAME OVER";
  gameOverText.className = "game-over-text";
  gameWorldElement.append(gameOverText);

  function updateSnakeParts(snakeState: Position[], snakeColor: string) {
    // snake has grown!
    for (let i = renderedSnakeParts.length; i < snakeState.length; i += 1) {
      const snakePart = createSnakePart();
      renderedSnakeParts.push(snakePart);
      gameWorldElement.append(snakePart);
    }

    for (let i = 0; i < renderedSnakeParts.length; i += 1) {
      const snakePart = renderedSnakeParts[i];
      const currPos = snakeState[i];

      snakePart.style.bottom = currPos.y * GRID_SIZE + "%";
      snakePart.style.left = currPos.x * GRID_SIZE + "%";
      snakePart.style.background = snakeColor;
    }
  }

  function updateScore(scoreState: number) {
    scoreElement.innerText = scoreState + "";
  }

  function updateGameOverText(isGameOver: boolean) {
    if (isGameOver) {
      gameWorldElement.classList.add("game-over");
      gameOverText.style.display = "block";

      setTimeout(() => {
        startButtonElement.style.display = "block";
      }, 2000);
    } else {
      gameWorldElement.classList.remove("game-over");
      gameOverText.style.display = "none";
      startButtonElement.style.display = "none";
    }
  }

  function updateFruit(fruitState: Fruit | null | undefined) {
    if (fruitState) {
      fruit.style.display = "block";
      fruit.style.bottom = fruitState.position.y * GRID_SIZE + "%";
      fruit.style.left = fruitState.position.x * GRID_SIZE + "%";
      fruit.style.backgroundColor = fruitState.color;
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
