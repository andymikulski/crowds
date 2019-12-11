import Vector from '../etc/Vector2D';
import { SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF, WORLD_DEPTH, WORLD_DEPTH_HALF } from "../config";
import { PositionTrait, DisplayTrait } from '../traits';


function depthSort(a: PositionTrait, b: PositionTrait): number {
  if (a.position.values[2] > b.position.values[2]) {
    return 1;
  }
  else if (a.position.values[2] < b.position.values[2]) {
    return -1;
  }
  else {
    return 0;
  }
}


export class AgentDisplay {
  canvas: HTMLCanvasElement;
  tick: number = 0;
  context: CanvasRenderingContext2D;
  backgroundPattern: CanvasPattern;
  offContext: CanvasRenderingContext2D;
  constructor(private width: number, private height: number) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    const context = canvas.getContext('2d');
    this.canvas = canvas;
    this.context = context;
  }

  static drawCircle3D(context: CanvasRenderingContext2D, agent: DisplayTrait) {
    const xPrime = ((agent.position.values[0] - SCREEN_WIDTH_HALF) * (90 / agent.position.values[2])) + SCREEN_WIDTH_HALF;
    const yPrime = ((agent.position.values[1] - SCREEN_HEIGHT_HALF) * (90 / agent.position.values[2])) + SCREEN_HEIGHT_HALF;
    context.arc(xPrime, yPrime, Math.max(1, agent.size * (1 - ((agent.position.values[2] || WORLD_DEPTH_HALF) / WORLD_DEPTH))), 0, 2 * Math.PI, false);
  }

  static drawCircle2D(context: CanvasRenderingContext2D, agent: DisplayTrait) {
    context.arc(agent.position.values[0] - (agent.size / 2), agent.position.values[1] - (agent.size / 2), agent.size, 0, 2 * Math.PI, false);
  }

  public draw(agents: DisplayTrait[], agentCount: number, render3D: 0 | 1 = 1) {
    agents = agents.sort(depthSort);
    this.context.clearRect(0, 0, this.width, this.height);

    // this.context.fillStyle = 'rgba(255,255,255,0.025)';
    // this.context.fillRect(0, 0, this.width, this.height);

    let i = agentCount - 1;
    let currentAgent;
    while (i >= 0) {
      currentAgent = agents[i];
      this.context.beginPath();
      this.context.fillStyle = currentAgent.color;
      AgentDisplay[render3D === 1 ? 'drawCircle3D' : 'drawCircle2D'](this.context, currentAgent);
      this.context.fill();
      this.context.closePath();
      i -= 1;
    }
  }
  public pointAt(pos: Vector, size: number = 4) {
    this.context.fillStyle = '#000';
    this.context.fillRect(pos.values[0] - (size / 2), pos.values[1] - (size / 2), size, size);
  }
}
