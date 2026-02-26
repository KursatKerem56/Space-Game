class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
    this.player = new Player(this);
    this.enemies = [];
    this.bullets = [];
    // this.spawnEnemy();
    this.init();
    requestAnimationFrame(() => this.gameLoop());
  }

  init() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft") {
        this.player.rotateLeft = true;
      }
      if (e.code === "ArrowRight") {
        this.player.rotateRight = true;
      }
      if (e.code === "ArrowUp") {
        this.player.thrust = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft") {
        this.player.rotateLeft = false;
      }
      if (e.code === "ArrowRight") {
        this.player.rotateRight = false;
      }
      if (e.code === "ArrowUp") {
        this.player.thrust = false;
      }
    });
  }

  spawnEnemy() {
    const x = Math.random() * (this.width - 50);
    const y = -50;
    this.enemies.push(new Enemy(this, x, y));
  }

  gameLoop() {
    this.canvas.width = this.width = window.innerWidth;
    this.canvas.height = this.height = window.innerHeight;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.player.update();
    this.player.draw(this.ctx);

    requestAnimationFrame(() => this.gameLoop());
  }
}
