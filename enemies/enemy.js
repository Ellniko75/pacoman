import { ctx } from "../canvas.js";
import { pacman } from "../pacmanPlayer.js";
import { manageCollisionCheap } from "../collisions.js";
import { worldMap } from "../world.js";

export function createEnemy({ x, y, width, height }) {
  return {
    x,
    y,
    speed: 1,
    pathToPacoman: [],
    indexOfPath: 1,
    width,
    height,

    pastSixPositions: [],
    currentMovement: "down",
    allowMovement: {
      right: true,
      left: true,
      down: true,
      up: true,
    },
    teleportEnemy() {
      if (this.x <= 0 - this.width) {
        this.x = 900;
      } else if (this.x >= 900 + this.width) {
        this.x = 0 - this.width;
      }
    },
    tick() {
      this.teleportEnemy();
      this.changeMovement();
      this.moveEachFrame();
      this.resetAllowMovement();
    },
    //Only runs when the enemy needs to actually change movement; when the enemy is in a INTEGER position in the map array
    changeMovement() {
      if (Number.isInteger(this.x / this.width) && Number.isInteger(this.y / this.height)) {
        manageCollisionCheap(this);
        this.moveBasedOnDistanceToPacoman();
      }
    },
    moveBasedOnDistanceToPacoman() {
      //pacman coordinates
      const [pacomanY, pacomanX] = worldMap.getItemPositionInArray(pacman);
      //enemy coordinates
      const [y, x] = worldMap.getItemPositionInArray(this);

      let currentHipotenusaLength = 999999999;
      let movementChosen = "";

      //calculate distance moving to the right
      if (this.currentMovement != "left" && this.allowMovement.right) {
        const rightX = x + 1;
        const xDifference = Math.abs(pacomanX - rightX);
        const yDifference = Math.abs(pacomanY - y);
        const hipotenusa = Math.sqrt(Math.pow(xDifference, 2) * Math.pow(yDifference, 2));
        if (hipotenusa < currentHipotenusaLength || movementChosen == "") {
          currentHipotenusaLength = hipotenusa;
          movementChosen = "right";
        }
      }
      //calculate distance moving to the left
      if (this.currentMovement != "right" && this.allowMovement.left) {
        const leftx = x - 1;
        const xDifference = Math.abs(pacomanX - leftx);
        const yDifference = Math.abs(pacomanY - y);
        const hipotenusa = Math.sqrt(Math.pow(xDifference, 2) * Math.pow(yDifference, 2));

        if (hipotenusa < currentHipotenusaLength || movementChosen == "") {
          currentHipotenusaLength = hipotenusa;
          movementChosen = "left";
        }
      }
      //calculate distance moving down
      if (this.currentMovement != "up" && this.allowMovement.down) {
        const downY = y + 1;
        const xDifference = Math.abs(pacomanX - x);
        const yDifference = Math.abs(pacomanY - downY);
        const hipotenusa = Math.sqrt(Math.pow(xDifference, 2) * Math.pow(yDifference, 2));

        if (hipotenusa < currentHipotenusaLength || movementChosen == "") {
          currentHipotenusaLength = hipotenusa;
          movementChosen = "down";
        }
      }
      //calculate distance moving up
      if (this.currentMovement != "down" && this.allowMovement.up) {
        const upY = y - 1;
        const xDifference = Math.abs(pacomanX - x);
        const yDifference = Math.abs(pacomanY - upY);
        const hipotenusa = Math.sqrt(Math.pow(xDifference, 2) * Math.pow(yDifference, 2));
        if (hipotenusa < currentHipotenusaLength || movementChosen == "") {
          currentHipotenusaLength = hipotenusa;
          movementChosen = "up";
        }
      }
      this.currentMovement = movementChosen;

      //adjust in case the axis are the same

      if (pacomanX == x) {
        if (pacomanY > y && this.allowMovement.down) {
          this.currentMovement = "down";
        } else if (pacomanY < y && this.allowMovement.up) {
          this.currentMovement = "up";
        }
      } else if (pacomanY == y) {
        if (pacomanX < x && this.allowMovement.left) {
          this.currentMovement = "left";
        } else if (pacomanX > x && this.allowMovement.right) {
          this.currentMovement = "right";
        }
      }
    },
    moveEachFrame() {
      if (this.allowMovement.down && this.currentMovement == "down") {
        this.y += 1;
      }
      if (this.allowMovement.up && this.currentMovement == "up") {
        this.y -= 1;
      }
      if (this.allowMovement.right && this.currentMovement == "right") {
        this.x += 1;
      }
      if (this.allowMovement.left && this.currentMovement == "left") {
        this.x -= 1;
      }
    },
    resetAllowMovement() {
      this.right = true;
      this.up = true;
      this.down = true;
      this.left = true;
    },
    draw() {
      this.tick();
      ctx.fillStyle = "wheat";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "blue";
    },
  };
}
