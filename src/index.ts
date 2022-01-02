import { CONTROL_DIRECTION_MAP } from "./constants";
import { render } from "./gameObjects";
import { initGameState, startGameLoop } from "./gameState";

(() => {
  let gameState = initGameState();

  let end;
  render(gameState);

  document.getElementById("restart").onclick = () => {
    if (end) {
      end();
    }
    gameState = initGameState();
    render(gameState);
    end = startGameLoop(gameState, 10);
  };

  document.addEventListener("keydown", ({ key }) => {
    gameState.update((state) => {
      return { snakeDirection: CONTROL_DIRECTION_MAP[key] };
    });
  });
})();
