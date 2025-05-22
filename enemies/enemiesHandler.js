import { createEnemy } from "./enemy.js";

export const enemiesHandler = {
  enemiesArr: [],
  defaultEnemyWidth: 30,
  defaultEnemyHeight: 30,
  init(ctx) {
    const enemy1 = createEnemy({ x: 390, y: 30, ctx: ctx, width: 30, height: 30 });
    this.enemiesArr.push(enemy1);
  },
  createEnemy(x, y, width, height) {
    return {
      x,
      y,
      width,
      height,
    };
  },
  draw() {
    this.enemiesArr.forEach((enemy) => {
      enemy.draw();
    });
  },
};
