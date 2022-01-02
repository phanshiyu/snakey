export function makeGameState<T extends Record<string, unknown>>(
  initGameState: T
) {
  let subscribers = new Set<(state: T, oldState?: T) => any>();
  let gameState = { ...initGameState };

  function get() {
    return gameState;
  }

  function update(
    newGameStateOrFn: ((oldState: T) => Partial<T>) | Partial<T>
  ) {
    let newGameState = {};
    if (typeof newGameStateOrFn === "function") {
      newGameState = newGameStateOrFn(gameState);
    } else {
      newGameState = newGameStateOrFn;
    }

    let oldState = { ...gameState };
    gameState = { ...gameState, ...newGameState };

    subscribers.forEach((fn) => {
      fn(gameState, oldState);
    });
  }

  function subscribe(callback: (state: T, oldState?: T) => any) {
    callback(gameState, undefined);
    subscribers.add(callback);
  }

  function unsubscribe(fn: (state: T) => any) {
    subscribers.delete(fn);
  }

  return {
    subscribe,
    unsubscribe,
    get,
    update,
    reset: () => {
      update(initGameState);
    },
  };
}
