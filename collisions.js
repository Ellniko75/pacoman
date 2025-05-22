import { worldMap } from "./world.js";
import { pacman } from "./pacmanPlayer.js";

export function manageCollisionWithFood() {
  //get the world position of pacman to map it to the indices of the world array
  const x = Math.floor(pacman.x / 30);
  const y = Math.floor(pacman.y / 30);

  const xForUpAndLeft = Math.ceil(pacman.x / 30);
  const YForUpAndLeft = Math.ceil(pacman.y / 30);

  const map = worldMap.map;

  //Need to calculate the collision differently for the left and right because the X and Y value
  //of pacman is always to the utmost Left and the utmost Up. So when you are going left, as soon as
  //you enter the left quadrant, you would detect the food. But that looks ugly, so you need to calculate
  //when pacman has already gone through the entirety of the quadrant
  if (pacman.currentMovement == "left" || pacman.currentMovement == "up") {
    if (map[YForUpAndLeft][xForUpAndLeft] == 0) {
      map[YForUpAndLeft][xForUpAndLeft] = 2;
      pacman.playEatingSound();
    }
  } else if (map[y][x] == 0) {
    pacman.playEatingSound();
    map[y][x] = 2;
  }
}

export function manageCollisionCheap(obj) {
  const [y, x, yRaw, xRaw] = worldMap.getItemPositionInArray(obj);

  //since we can never move in a non integer position eg y:34.6 x:211.59 we don't check anything more
  if (!Number.isInteger(yRaw) || !Number.isInteger(xRaw)) {
    return;
  }

  //check down
  if (y < worldMap.map.length - 1) {
    let down = worldMap.map[y + 1][x];
    if (down == 1) {
      obj.allowMovement.down = false;
    } else {
      obj.allowMovement.down = true;
    }
  }
  //check left
  if (x > 0) {
    let left = worldMap.map[y][x - 1];
    if (left == 1) {
      obj.allowMovement.left = false;
    } else {
      obj.allowMovement.left = true;
    }
  }
  //check right
  let right = worldMap.map[y][x + 1];
  if (right == 1) {
    obj.allowMovement.right = false;
  } else {
    obj.allowMovement.right = true;
  }
  //check up
  if (y > 0) {
    const up = worldMap.map[y - 1][x];
    if (up == 1) {
      obj.allowMovement.up = false;
    } else {
      obj.allowMovement.up = true;
    }
  }
}
