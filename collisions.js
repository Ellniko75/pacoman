import { worldMap } from "./world.js";
import { pacman } from "./pacmanPlayer.js";

const allWorldObstacleBounds = [];

export function initWorldBoundings() {
  const map = worldMap.map;
  map.forEach((line, y) => {
    line.forEach((item, x) => {
      if (item == 1) {
        const boundings = getBoundingOfObstacle(y, x, worldMap.widthAndHeightOfObstacle, worldMap.widthAndHeightOfObstacle);

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

function getBoundingOfObstacle(y, x, obstacleWidth, obstacleHeight) {
  //need to do this because y and x are indexes, not x and y positions
  let realX = x * obstacleWidth;
  let realY = y * obstacleHeight;
  const obstacleLeft = realX;
  const obstacleUp = realY;
  const obstacleRight = realX + obstacleWidth;
  const obstacleDown = realY + obstacleHeight;

  return [obstacleLeft, obstacleRight, obstacleUp, obstacleDown];
}

//if there is a collision moves the player back so that it is not colliding
function isCollision(allowMovement, arrOfBounds) {
  const [left, right, up, down] = getBounding(pacman);
  let [gLeft, gRight, gUp, gDown] = arrOfBounds;

  //collision down
  if (down >= gUp && down - gUp < pacman.speed + 0.1 && left < gRight && right > gLeft && up < gUp) {
    console.log("down");
    allowMovement.down = false;
    const difference = down - gUp;
    pacman.y -= difference;
  }

  //collision left
  if (left <= gRight && gRight - left < pacman.speed + 0.1 && down > gUp && up < gDown && right > gRight) {
    console.log("left");
    allowMovement.left = false;
    const difference = gRight - left;
    pacman.x += difference;
  }
  //collision right
  if (right >= gLeft && right - gLeft < pacman.speed + 0.1 && down > gUp && up < gDown && left < gLeft) {
    console.log("right");
    allowMovement.right = false;
    const difference = right - gLeft;
    pacman.x -= difference;
  }
  //collision up
  if (up <= gDown && gDown - up < pacman.speed + 0.1 && left < gRight && right > gLeft && down > gDown) {
    console.log("up");
    allowMovement.up = false;
    const difference = gDown - up;
    pacman.y += difference;
  }
}

export function debuggingCollision() {
  setInterval(() => {
    const [left, right, up, down] = getBounding(pacman);
    console.log("left: ", left, " right: ", right, " up: ", up, " down: ", down);
  }, 200);
}

export function manageCollision(allowMovement) {
  const map = worldMap.map;
  allWorldObstacleBounds.forEach((bound) => {
    isCollision(allowMovement, bound);
  });
}
