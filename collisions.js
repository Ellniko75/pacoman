import { worldMap } from "./world.js";
import { pacman } from "./pacmanPlayer.js";

const allWorldObstacleBounds = [];

export function initWorldBoundings() {
  const map = worldMap.map;
  map.forEach((line, y) => {
    line.forEach((item, x) => {
      const worldObject = worldMap.getWorldMapObject(x, y);
      if (worldObject.isObstacle) {
        const boundings = getBoundingOfObstacle(worldObject);
        allWorldObstacleBounds.push(boundings);
      }
    });
  });
}

function getBounding(gameObject) {
  const playerLeft = gameObject.x;
  const playerRight = gameObject.x + gameObject.width;
  const playerUp = gameObject.y;
  const playerDown = gameObject.y + gameObject.height;
  return [playerLeft, playerRight, playerUp, playerDown];
}

function getBoundingOfObstacle({ y, x, width, height }) {
  //need to do this because y and x are indexes, not x and y positions
  let realX = x * width;
  let realY = y * height;
  const obstacleLeft = realX;
  const obstacleUp = realY;
  const obstacleRight = realX + width;
  const obstacleDown = realY + height;

  return [obstacleLeft, obstacleRight, obstacleUp, obstacleDown];
}

//if there is a collision moves the player back so that it is not colliding
function isCollisionObstacle(allowMovement, arrOfBounds) {
  const [left, right, up, down] = getBounding(pacman);
  let [gLeft, gRight, gUp, gDown] = arrOfBounds;

  //collision down
  if (down >= gUp && down - gUp < pacman.speed + 0.1 && left < gRight && right > gLeft && up < gUp) {
    //console.log("down");
    allowMovement.down = false;
    const difference = down - gUp;
    pacman.y -= difference;
  }

  //collision left
  if (left <= gRight && gRight - left < pacman.speed + 0.1 && down > gUp && up < gDown && right > gRight) {
    // console.log("left");
    allowMovement.left = false;
    const difference = gRight - left;
    pacman.x += difference;
  }
  //collision right
  if (right >= gLeft && right - gLeft < pacman.speed + 0.1 && down > gUp && up < gDown && left < gLeft) {
    // console.log("right");
    allowMovement.right = false;
    const difference = right - gLeft;
    pacman.x -= difference;
  }
  //collision up
  if (up <= gDown && gDown - up < pacman.speed + 0.1 && left < gRight && right > gLeft && down > gDown) {
    // console.log("up");
    allowMovement.up = false;
    const difference = gDown - up;
    pacman.y += difference;
  }
}

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

export function manageCollision(allowMovement) {
  const map = worldMap.map;
  allWorldObstacleBounds.forEach((bound) => {
    isCollisionObstacle(allowMovement, bound);
  });
}
