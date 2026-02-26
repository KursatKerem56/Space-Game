class Player {
  constructor(game) {
    this.game = game;
    this.size = 50;
    this.x = game.width / 2;
    this.y = game.height / 2;
    this.speed = 0;
    this.color = "white";
    this.angle = 0;
    this.shipCorners = this.calculateCorners();
    this.flameCorners = this.calculateFlameCorners();
    this.flameParticles = [];
    this.flameColorCode = "207, 53, 46";
    this.rotateLeft = false;
    this.rotateRight = false;
    this.thrust = false;
    this.leftThrust = 0;
    this.rightThrust = 0;
    this.maxSpeed = 3;
    this.maxRotationThrust = 0.05;
    this.particleMaxLife = 100;
    this.thrustVector = { dir: this.angle, power: 0 };
  }

  update() {
    // calculate corners for collision detection
    this.shipCorners = this.calculateCorners();
    this.flameCorners = this.calculateFlameCorners();

    if (this.rotateLeft && !this.rotateRight) this.rightThrust += 0.001;
    if (this.rotateRight && !this.rotateLeft) this.leftThrust += 0.001;
    if (this.thrust) this.speed += 0.05;

    // apply friction
    this.speed *= 0.99;
    this.leftThrust *= 0.98;
    this.rightThrust *= 0.98;

    const treshold = 0.01;
    if (this.speed < treshold) {
      this.speed = 0;
      this.thrustVector.dir = this.angle;
    } else if (this.thrust) {
      this.thrustVector.dir += (this.angle - this.thrustVector.dir) * 0.01;
    }
    if (this.leftThrust < treshold / 11) this.leftThrust = 0;
    if (this.rightThrust < treshold / 11) this.rightThrust = 0;

    this.speed = Math.min(this.speed, this.maxSpeed);
    this.leftThrust = Math.min(this.leftThrust, this.maxRotationThrust);
    this.rightThrust = Math.min(this.rightThrust, this.maxRotationThrust);

    // update thrust vector
    this.thrustVector.power = this.speed;

    // update position based on thrust vector
    // this.x += Math.cos(this.thrustVector.dir) * this.thrustVector.power;
    // this.y += Math.sin(this.thrustVector.dir) * this.thrustVector.power;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // apply rotation from thrust
    this.angle += this.leftThrust;
    this.angle -= this.rightThrust;

    // add flame particles when thrusting
    if (this.speed > 0.1) {
      this.flameParticles.push({
        x: this.flameCorners[0].x,
        y: this.flameCorners[0].y,
        life: this.particleMaxLife,
        angle: this.angle + Math.PI + (Math.random() - 0.5) * 0.5,
        speed: Math.random() * (1 + this.speed / this.maxSpeed) + 1,
      });
    }

    // update flame particles
    if (this.flameParticles.length > 0) {
      this.flameParticles.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;
      });
    }

    // remove dead particles
    this.flameParticles = this.flameParticles.filter((p) => p.life > 0);
  }

  draw(ctx) {
    // center dot
    // ctx.beginPath();
    // ctx.fillStyle = "red";
    // ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();

    // ship body
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.shipCorners[0].x, this.shipCorners[0].y);
    for (let i = 1; i < this.shipCorners.length + 1; i++) {
      ctx.lineTo(
        this.shipCorners[i % this.shipCorners.length].x,
        this.shipCorners[i % this.shipCorners.length].y,
      );
    }
    ctx.stroke();
    ctx.closePath();

    // ship direction line
    // if (this.thrust) {
    //   ctx.beginPath();
    //   ctx.strokeStyle = "orange";
    //   ctx.lineWidth = 2;
    //   ctx.moveTo(this.x, this.y);
    //   ctx.lineTo(
    //     this.x + Math.cos(this.thrustVector.dir) * this.size * 1.5,
    //     this.y + Math.sin(this.thrustVector.dir) * this.size * 1.5,
    //   );
    //   ctx.stroke();
    //   ctx.closePath();
    // }

    // thrust flame
    if (this.speed > 0) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.flameColorCode}, ${this.speed / this.maxSpeed})`;
      ctx.moveTo(this.flameCorners[0].x, this.flameCorners[0].y);
      for (let i = 1; i < this.flameCorners.length + 1; i++) {
        ctx.lineTo(
          this.flameCorners[i % this.flameCorners.length].x,
          this.flameCorners[i % this.flameCorners.length].y,
        );
      }
      ctx.fill();
      ctx.closePath();
    }

    // draw flame particles
    this.flameParticles.forEach((p) => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.flameColorCode}, ${p.life / this.particleMaxLife})`;
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });
  }

  calculateCorners() {
    return [
      // nose
      {
        x: this.x + Math.cos(this.angle) * this.size * 1.3,
        y: this.y + Math.sin(this.angle) * this.size * 1.3,
      },
      // left corner
      {
        x: this.x + Math.cos(this.angle + (Math.PI * 4) / 3) * this.size,
        y: this.y + Math.sin(this.angle + (Math.PI * 4) / 3) * this.size,
      },
      // right corner
      {
        x: this.x + Math.cos(this.angle + (Math.PI * 2) / 3) * this.size,
        y: this.y + Math.sin(this.angle + (Math.PI * 2) / 3) * this.size,
      },
    ];
  }

  calculateFlameCorners() {
    return [
      // nose of flame
      {
        x:
          this.x -
          Math.cos(this.angle) * this.size * (0.5 + this.speed / this.maxSpeed),
        y:
          this.y -
          Math.sin(this.angle) * this.size * (0.5 + this.speed / this.maxSpeed),
      },
      // left corner of flame
      {
        x:
          this.x +
          Math.cos(this.angle + (Math.PI * 4) / 3) * this.size +
          Math.cos(this.angle + Math.PI / 2) * this.size * 0.4,
        y:
          this.y +
          Math.sin(this.angle + (Math.PI * 4) / 3) * this.size +
          Math.sin(this.angle + Math.PI / 2) * this.size * 0.4,
      },
      // right corner of flame
      {
        x:
          this.x +
          Math.cos(this.angle + (Math.PI * 2) / 3) * this.size -
          Math.cos(this.angle + Math.PI / 2) * this.size * 0.4,
        y:
          this.y +
          Math.sin(this.angle + (Math.PI * 2) / 3) * this.size -
          Math.sin(this.angle + Math.PI / 2) * this.size * 0.4,
      },
    ];
  }
}
