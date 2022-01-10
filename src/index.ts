import { CONTROL_DIRECTION_MAP, FRAMES_PER_SECOND } from "./constants";
import { render } from "./renderDomElements";
import {
  initGameState,
  SnakeGameState,
  calculateNextGameState,
  calculateNextSnakeDirection,
} from "./gameState/gameState";
import { INITIAL_GAME_STATE } from "./gameState/intialGameState";
import { Direction } from "./gameState/types";

// Global variables so that we can perform cleaning up
let stopGameLoop: ReturnType<typeof startGameLoop>;
let handleKeyDown: ((event: KeyboardEvent) => void) | undefined;
let handleTouchStart: ((event: TouchEvent) => void) | undefined;
let handleTouchMove: ((event: TouchEvent) => void) | undefined;

(() => {
  const startButtonElement = document.getElementById("restart");
  const gameWorldElement = document.getElementById("game-world");
  const scoreElement = document.getElementById("score");

  function start() {
    // Check if required HTML elements are rendered
    if (!gameWorldElement || !scoreElement || !startButtonElement) {
      throw new Error("Cannot find needed pre rendered elements!");
    }
    gameWorldElement.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });

    // If there currently an existing gamr loop running, we stop it first
    if (stopGameLoop) {
      stopGameLoop();
    }

    const gameState = initGameState(INITIAL_GAME_STATE);
    stopGameLoop = startGameLoop(gameState, FRAMES_PER_SECOND + 5);

    // Create initial UI and get back a bunch of methods to update various parts of our UI
    const { updateSnakeParts, updateFruit, updateScore, updateGameOverText } =
      render({
        gameWorldElement,
        scoreElement,
        startButtonElement,
      });

    // Subscribe to the game state, and update our UI accordingly
    gameState.subscribe(({ snake, snakeColor, fruit, score, isGameOver }) => {
      updateSnakeParts(snake, snakeColor);
      updateFruit(fruit);
      updateScore(score);
      updateGameOverText(isGameOver);
    });

    // Clean up event listener
    if (handleKeyDown) {
      document.removeEventListener("keydown", handleKeyDown);
      handleKeyDown = undefined;
    }

    if (handleTouchStart) {
      document.removeEventListener("touchstart", handleTouchStart);
      handleTouchStart = undefined;
    }

    if (handleTouchMove) {
      document.removeEventListener("touchmove", handleTouchMove);
      handleTouchStart = undefined;
    }

    function changeSnakeDirection(key: keyof typeof CONTROL_DIRECTION_MAP) {
      gameState.update(({ snakeDirection }) => {
        let nextSnakeDirection = calculateNextSnakeDirection(
          snakeDirection,
          CONTROL_DIRECTION_MAP[key]
        );

        return {
          snakeDirection: nextSnakeDirection,
        };
      });
    }

    handleKeyDown = (event) => {
      const { key } = event;
      console.log("hello");
      event.preventDefault();
      event.stopImmediatePropagation();

      if (key in CONTROL_DIRECTION_MAP) {
        changeSnakeDirection(key as keyof typeof CONTROL_DIRECTION_MAP);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    let xDown: number | null;
    let yDown: number | null;

    handleTouchStart = (evt: TouchEvent) => {
      const firstTouch = evt.touches[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    };

    let timeout: NodeJS.Timeout | null = null;

    handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      if (!xDown || !yDown) {
        return;
      }

      const xUp = event.touches[0].clientX;
      const yUp = event.touches[0].clientY;

      const xDiff = xDown - xUp;
      const yDiff = yDown - yUp;

      const THRESHOLD = 50;
      const isPastSensitivityThreshold =
        Math.abs(yDiff) > THRESHOLD || Math.abs(xDiff) > THRESHOLD;

      if (!timeout && isPastSensitivityThreshold) {
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          /*most significant*/
          if (xDiff > 0) {
            changeSnakeDirection("ArrowLeft");
          } else {
            changeSnakeDirection("ArrowRight");
          }
        } else {
          if (yDiff > 0) {
            changeSnakeDirection("ArrowUp");
          } else {
            changeSnakeDirection("ArrowDown");
          }
        }
        /* reset values */
        xDown = xUp;
        yDown = yUp;

        timeout = setTimeout(() => {
          timeout = null;
        }, 200);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
  }

  // Assign start to button onclick
  if (!startButtonElement) {
    throw new Error("Cannot find needed pre rendered elements!");
  }
  startButtonElement.onclick = start;
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
