import { CONTROL_DIRECTION_MAP } from "./constants";
import { render } from "./gameObjects";
import { initGameState, SnakeGameState, startGameLoop } from "./gameState";

(() => {
  const restartButtonElement = document.getElementById("restart");
  const gameWorldElement = document.getElementById("game-world");
  const scoreElement = document.getElementById("score");

  if (!restartButtonElement) {
    throw new Error("Cannot find needed pre rendered elements!");
  }

  let stopGameLoop: ReturnType<typeof startGameLoop>;
  let gameState: SnakeGameState;

  function start() {
    if (!gameWorldElement || !scoreElement || !restartButtonElement) {
      throw new Error("Cannot find needed pre rendered elements!");
    }

    if (stopGameLoop) {
      stopGameLoop();
    }

    gameState = initGameState();
    stopGameLoop = startGameLoop(gameState, 10);
    render(gameState, {
      gameWorldElement,
      scoreElement,
    });
  }

  function handleKeyDown({ key }: KeyboardEvent) {
    gameState.update((state) => {
      return { snakeDirection: CONTROL_DIRECTION_MAP[key] };
    });
  }

  start();
  restartButtonElement.onclick = start;

  document.addEventListener("keydown", handleKeyDown);
})();
