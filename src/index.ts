import { CONTROL_DIRECTION_MAP, GRID_SIZE, WORLD_LENGTH } from "./constants";
import { gameState } from "./gameState";

function createSnakePart(i: number) {
  const snakePart = document.createElement("div");
  snakePart.style.width = `${GRID_SIZE}px`;
  snakePart.style.height = `${GRID_SIZE}px`;
  snakePart.style.background = "black";
  snakePart.style.position = "absolute";

  gameState.subscribe((state) => {
    snakePart.style.bottom = state.snake[i].y * GRID_SIZE + "px";
    snakePart.style.left = state.snake[i].x * GRID_SIZE + "px";
  });

  return snakePart;
}

function createFruit() {
  const fruit = document.createElement("div");
  fruit.style.width = `${GRID_SIZE}px`;
  fruit.style.height = `${GRID_SIZE}px`;
  fruit.style.background = "red";
  fruit.style.position = "absolute";

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

(() => {
  // reset
  const gameWorld = document.getElementById("game-world");
  gameWorld.style.height = `${WORLD_LENGTH * GRID_SIZE}px`;
  gameWorld.style.width = `${WORLD_LENGTH * GRID_SIZE}px`;
  gameWorld.innerHTML = "";
  gameState.reset();

  const scoreElement = document.createElement("h2");
  document.body.append(scoreElement);
  gameState.subscribe((state) => {
    scoreElement.innerText = state.score + "";
  });

  let renderedSnakePartsCount = 0;

  gameState.subscribe((state) => {
    // snake has grown!
    while (renderedSnakePartsCount < state.snake.length) {
      const snakePart = createSnakePart(renderedSnakePartsCount);
      gameWorld.append(snakePart);

      renderedSnakePartsCount += 1;
    }
  });

  gameWorld.append(createFruit());

  const endGame = gameLoop(100);

  gameState.subscribe(({ isGameOver }) => {
    if (isGameOver) {
      endGame();
      const gameOverText = document.createElement("h1");
      gameOverText.innerText = "GAME OVER";
      gameWorld.append(gameOverText);
    }
  });
})();

function gameLoop(intervalInMs: number) {
  const interval = setInterval(() => {
    gameState.update((state) => {
      if (state.snakeDirection.x === 0 && state.snakeDirection.y === 0)
        return state;

      const currSnakeHead = state.snake[0];
      // check for collision
      for (let i = 1; i < state.snake.length; i += 1) {
        if (
          currSnakeHead.x === state.snake[i].x &&
          currSnakeHead.y === state.snake[i].y
        )
          return {
            isGameOver: true,
          };
      }

      let newSnakeHead = {
        x: currSnakeHead.x + state.snakeDirection.x,
        y: currSnakeHead.y + state.snakeDirection.y,
      };

      // check if pass boundary
      if (newSnakeHead.x < 0) {
        newSnakeHead.x = WORLD_LENGTH - 1;
      } else if (newSnakeHead.x >= WORLD_LENGTH) {
        newSnakeHead.x = 0;
      }
      if (newSnakeHead.y < 0) {
        newSnakeHead.y = WORLD_LENGTH - 1;
      } else if (newSnakeHead.y >= WORLD_LENGTH) {
        newSnakeHead.y = 0;
      }

      const newSnakeBoday = [...state.snake];

      let score = state.score;
      if (
        state.fruit &&
        state.fruit.x === newSnakeHead.x &&
        state.fruit.y === newSnakeHead.y
      ) {
        // snake head touch de fruit
        state.fruit = null;
        score += 1;
      } else {
        newSnakeBoday.pop();
      }
      return {
        snake: [newSnakeHead, ...newSnakeBoday],
        fruit: state.fruit ?? {
          x: Math.floor(Math.random() * WORLD_LENGTH),
          y: Math.floor(Math.random() * WORLD_LENGTH),
        },
        score,
      };
    });
  }, intervalInMs);

  return () => {
    clearInterval(interval);
  };
}

document.addEventListener("keydown", ({ key }) => {
  gameState.update((state) => {
    return { snakeDirection: CONTROL_DIRECTION_MAP[key] };
  });
});
