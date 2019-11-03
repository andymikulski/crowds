import PerlinNoise from '../etc/perlin';
import { SCREEN_HEIGHT, SCREEN_WIDTH, CELL_SIZE, TERRAIN_WALKABLE_THRESHOLD } from '../config';

export class TerrainDisplay {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  noise: PerlinNoise = new PerlinNoise(266625345);
  chaos: number = 0.009;

  walkableThreshold: number = TERRAIN_WALKABLE_THRESHOLD;

  walkablePath: boolean[][];


  constructor(public width: number, public height: number) {
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
    this.context.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    for (let y = 0; y < SCREEN_HEIGHT; y += CELL_SIZE) {
      this.context.moveTo(0, y);
      this.context.lineTo(SCREEN_WIDTH, y);
    }
    for (let x = 0; x < SCREEN_WIDTH; x += CELL_SIZE) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, SCREEN_HEIGHT);
    }
    this.context.closePath();
    this.context.stroke();
  }

  public drawWalkable() {
    this.context.strokeStyle = 'transparent';
    for (let y = 0; y < SCREEN_HEIGHT; y += CELL_SIZE) {
      for (let x = 0; x < SCREEN_WIDTH; x += CELL_SIZE) {
        let val = this.noise.perlin2(x * this.chaos, y * this.chaos);
        this.context.fillStyle = val < this.walkableThreshold ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255,0,0,0.25)';
        this.context.fillRect(x - (CELL_SIZE / 2), y - (CELL_SIZE / 2), CELL_SIZE, CELL_SIZE);
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
