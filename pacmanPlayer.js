import { manageCollisionWithFood, manageCollisionCheap } from "./collisions.js";
import { ctx } from "./canvas.js";

export const pacman = {
  x: 390,
  y: 90,
  speed: 1,
  width: 30,
  height: 30,
  pacmanImageOpenRight: document.createElement("img"),
  pacmanImageOpenLeft: document.createElement("img"),
  pacmanImageOpenDown: document.createElement("img"),
  pacmanImageOpenUp: document.createElement("img"),
  pacmanClosed: document.createElement("img"),
  open: true,
  up: false,
  right: false,
  left: false,
  down: false,
  currentMovement: "left",
  allowMovement: {
    right: true,
    left: true,
    down: true,
    up: true,
  },
  teleportPlayer() {
    if (this.x <= 0 - this.width) {
      this.x = 900;
    } else if (this.x >= 900 + this.width) {
      this.x = 0 - this.width;
    }
  },
  init() {
    //debuggingCollision();
    this.pacmanImageOpenRight.src = "./pacmanOpenRight.PNG";
    this.pacmanImageOpenLeft.src = "./pacmanOpenLeft.PNG";
    this.pacmanImageOpenDown.src = "./pacmanOpenDown.PNG";
    this.pacmanImageOpenUp.src = "./pacmanOpenUp.PNG";
    this.pacmanClosed.src = "./pacmanClosed.PNG";
    setInterval(() => {
      this.open = !this.open;
    }, 200);
    document.addEventListener("keydown", (e) => {
      const { key } = e;
      switch (key) {
        case "a":
          this.left = true;
          this.right = false;
          this.up = false;
          this.down = false;
          break;
        case "s":
          this.left = false;
          this.right = false;
          this.up = false;
          this.down = true;
          break;
        case "d":
          this.left = false;
          this.right = true;
          this.up = false;
          this.down = false;
          break;
        case "w":
          this.left = false;
          this.right = false;
          this.up = true;
          this.down = false;
          break;

        default:
          break;
      }
    });
    document.addEventListener("keyup", (e) => {
      this.left = false;
      this.right = false;
      this.up = false;
      this.down = false;
    });
  },
  playEatingSound() {
    const eatingSound = new Audio("./wakafull.mp3");
    eatingSound.volume = 0.1;
    eatingSound.play();
  },
  resetAllowMovement() {
    this.allowMovement.right = true;
    this.allowMovement.down = true;
    this.allowMovement.up = true;
    this.allowMovement.left = true;
  },
  move() {
    //we only check for world collisions on whole numbers and allow for the movement to change
    if (Number.isInteger(this.x / 30) && Number.isInteger(this.y / 30)) {
      manageCollisionWithFood();
      manageCollisionCheap(this);
      if (this.allowMovement.down && this.down) {
        this.currentMovement = "down";
      }
      if (this.allowMovement.up && this.up) {
        this.currentMovement = "up";
      }
      if (this.allowMovement.right && this.right) {
        this.currentMovement = "right";
      }
      if (this.allowMovement.left && this.left) {
        this.currentMovement = "left";
      }
    }

    if (this.currentMovement == "right" && this.allowMovement.right) {
      this.x += this.speed;
    }
    if (this.currentMovement == "left" && this.allowMovement.left) {
      this.x -= this.speed;
    }
    if (this.currentMovement == "down" && this.allowMovement.down) {
      this.y += this.speed;
    }
    if (this.currentMovement == "up" && this.allowMovement.up) {
      this.y -= this.speed;
    }
    this.resetAllowMovement();
  },
  draw() {
    this.teleportPlayer();
    let imageToDraw;
    if (!this.open) {
      imageToDraw = this.pacmanClosed;
    } else if (this.currentMovement == "up") {
      imageToDraw = this.pacmanImageOpenUp;
    } else if (this.currentMovement == "down") {
      imageToDraw = this.pacmanImageOpenDown;
    } else if (this.currentMovement == "right") {
      imageToDraw = this.pacmanImageOpenRight;
    } else {
      imageToDraw = this.pacmanImageOpenLeft;
    }

    ctx.drawImage(imageToDraw, this.x, this.y, this.width, this.height);
  },
};
