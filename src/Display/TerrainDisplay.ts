import PerlinNoise from '../etc/perlin';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../config';

export class TerrainDisplay {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  noise: PerlinNoise = new PerlinNoise(22555345);
  chaos: number = 0.009;

  walkableThreshold: number = 0.2;

  walkablePath: boolean[][];


  constructor(public width: number, public height: number, public cellSize: number = 5) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'terrain');
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    const context = canvas.getContext('2d');
    this.canvas = canvas;
    this.context = context;
  }


  public draw() {
    this.context.clearRect(0, 0, this.width, this.height);

    for (let y = 0; y < SCREEN_HEIGHT; y++) {
      for (let x = 0; x < SCREEN_WIDTH; x++) {
        let val = this.noise.perlin2(x * this.chaos, y * this.chaos);
        this.context.fillStyle = `rgb(${255 * val}, ${255 * val}, ${255 * val})`;
        this.context.fillRect(x, y, 1, 1);
      }
    }
  }

  public drawGrid() {
    this.context.beginPath();
    this.context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    for (let y = 0; y < SCREEN_HEIGHT; y += this.cellSize) {
      this.context.moveTo(0, y);
      this.context.lineTo(SCREEN_WIDTH, y);
    }
    for (let x = 0; x < SCREEN_WIDTH; x += this.cellSize) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, SCREEN_HEIGHT);
    }
    this.context.closePath();
    this.context.stroke();
  }

  public drawWalkable() {
    // this.walkablePath = [];
    for (let y = 0; y < SCREEN_HEIGHT; y += this.cellSize) {
      // this.walkablePath[y] = [];
      for (let x = 0; x < SCREEN_WIDTH; x += this.cellSize) {
        let val = this.noise.perlin2(x * this.chaos, y * this.chaos);
        this.context.fillStyle = val < this.walkableThreshold ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255,0,0,0.25)';
        this.context.fillRect(x - (this.cellSize / 2), y - (this.cellSize / 2), this.cellSize, this.cellSize);
        // this.walkablePath[y].push(val < this.walkableThreshold);
      }
    }
  }

  public isWalkableAt(x: number, y: number) {
    try {
      return this.noise.perlin2(x * this.chaos, y * this.chaos) < this.walkableThreshold;
      // return this.walkablePath[Math.round(y)][Math.round(x)] || false;
    } catch (err) {
      return false;
    }
  }
}
