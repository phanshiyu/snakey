import { getRandomPositiveInt } from "./randomInteger";

export function getRandomCssColor(): string {
  return `rgb(${getRandomPositiveInt(255)},${getRandomPositiveInt(
    255
  )},${getRandomPositiveInt(255)})`;
}
