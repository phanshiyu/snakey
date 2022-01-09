import { CONTROL_DIRECTION_MAP, FRAMES_PER_SECOND } from "./constants";
import { render } from "./renderDomElements";
import {
  initGameState,
  SnakeGameState,
  calculateNextGameState,
  calculateNextSnakeDirection,
} from "./gameState/gameState";
import { INITIAL_GAME_STATE } from "./gameState/intialGameState";

// Global variables so that we can perform cleaning up
let stopGameLoop: ReturnType<typeof startGameLoop>;
let handleKeyDown: ((event: KeyboardEvent) => void) | undefined;

(() => {
  const restartButtonElement = document.getElementById("restart");
  const gameWorldElement = document.getElementById("game-world");
  const scoreElement = document.getElementById("score");

  function start() {
    // Check if required HTML elements are rendered
    if (!gameWorldElement || !scoreElement || !restartButtonElement) {
      throw new Error("Cannot find needed pre rendered elements!");
    }

    // If there currently an existing gamr loop running, we stop it first
    if (stopGameLoop) {
      stopGameLoop();
    }

    const gameState = initGameState(INITIAL_GAME_STATE);
    stopGameLoop = startGameLoop(gameState, FRAMES_PER_SECOND);

    // Create initial UI and get back a bunch of methods to update various parts of our UI
    const { updateSnakeParts, updateFruit, updateScore, updateGameOverText } =
      render({
        gameWorldElement,
        scoreElement,
      });

    // Subscribe to the game state, and update our UI accordingly
    gameState.subscribe(({ snake, fruit, score, isGameOver }) => {
      updateSnakeParts(snake);
      updateFruit(fruit);
      updateScore(score);
      updateGameOverText(isGameOver);
    });

    // Clean up event listener
    if (handleKeyDown) {
      document.removeEventListener("keydown", handleKeyDown);
      handleKeyDown = undefined;
    }

    handleKeyDown = ({ key }) => {
      gameState.update(({ snakeDirection }) => {
        let nextSnakeDirection = calculateNextSnakeDirection(
          snakeDirection,
          CONTROL_DIRECTION_MAP[key]
        );

        return {
          snakeDirection: nextSnakeDirection,
        };
      });
    };

    document.addEventListener("keydown", handleKeyDown);
  }

  // Assign start to button onclick
  if (!restartButtonElement) {
    throw new Error("Cannot find needed pre rendered elements!");
  }
  restartButtonElement.onclick = start;
})();

/**
 * Starts the game loop via requestAnimationFrame
 * @param gameState
 * @param fps
 * @returns A clean up function to stop the game loop
 */
function startGameLoop(gameState: SnakeGameState, fps: number) {
  let isStopGameLoop = false;

  function loop() {
    setTimeout(() => {
      gameState.update((state) => {
        const nextState = calculateNextGameState(state);

        if (nextState.isGameOver) stopGameLoop();

        return nextState;
      });

      // Continue processing the next game state if isStopGameLoop is false
      if (!isStopGameLoop) requestAnimationFrame(loop);
    }, 1000 / fps);
  }

  requestAnimationFrame(loop);

  // Sets the flag to stop calling requestAnimationFrame
  function stopGameLoop() {
    isStopGameLoop = true;
  }

  return stopGameLoop;
}
