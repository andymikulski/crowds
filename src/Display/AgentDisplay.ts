import VecMath, { Vector } from '../etc/Vector2D';
import { SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF, WORLD_DEPTH, WORLD_DEPTH_HALF, AGENT_FOV_RADS, SPATIAL_HASH_SIZE, AGENT_FOV_HALF_RADS, AGENT_FOV_RANGE, AGENT_SIZE } from "../config";
import { PositionTrait, DisplayTrait, MotionTrait } from '../traits';


// function depthSort(a: PositionTrait, b: PositionTrait): number {
//   if (a.position[2] > b.position[2]) {
//     return 1;
//   }
//   else if (a.position[2] < b.position[2]) {
//     return -1;
//   }
//   else {
//     return 0;
//   }
// }


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

  // static drawCircle3D(context: CanvasRenderingContext2D, agent: DisplayTrait) {
  //   const xPrime = ((agent.position[0] - SCREEN_WIDTH_HALF) * (90 / agent.position[2])) + SCREEN_WIDTH_HALF;
  //   const yPrime = ((agent.position[1] - SCREEN_HEIGHT_HALF) * (90 / agent.position[2])) + SCREEN_HEIGHT_HALF;
  //   context.arc(xPrime, yPrime, Math.max(1, agent.size * (1 - ((agent.position[2] || WORLD_DEPTH_HALF) / WORLD_DEPTH))), 0, 2 * Math.PI, false);
  // }

  drawCircle2D(context: CanvasRenderingContext2D, agent: DisplayTrait) {
    context.arc(agent.position[0] - (agent.size / 2), agent.position[1] - (agent.size / 2), agent.size, 0, 2 * Math.PI, false);
  }

  static _tmpAngle: number;
  static _tmpSize: number;
  static _tmpPosX: number;
  static _tmpPosY: number;

  static drawPOV(context: CanvasRenderingContext2D, agent: DisplayTrait & MotionTrait) {
    AgentDisplay._tmpAngle = Math.atan2(agent.velocity[1], agent.velocity[0]);
    AgentDisplay._tmpSize = agent.size / 2;
    AgentDisplay._tmpPosX = agent.position[0] - AgentDisplay._tmpSize;
    AgentDisplay._tmpPosY = agent.position[1] - AgentDisplay._tmpSize;


    context.beginPath();
    context.moveTo(AgentDisplay._tmpPosX, AgentDisplay._tmpPosY);
    context.lineTo(
      AgentDisplay._tmpPosX + (Math.cos(AgentDisplay._tmpAngle - AGENT_FOV_HALF_RADS) * AGENT_FOV_RANGE),
      AgentDisplay._tmpPosY + (Math.sin(AgentDisplay._tmpAngle - AGENT_FOV_HALF_RADS) * AGENT_FOV_RANGE)
    );

    context.arc(
      AgentDisplay._tmpPosX,
      AgentDisplay._tmpPosY,
      AGENT_FOV_RANGE,
      AgentDisplay._tmpAngle - AGENT_FOV_HALF_RADS,
      AgentDisplay._tmpAngle + AGENT_FOV_HALF_RADS,
      false
    );

    context.lineTo(
      AgentDisplay._tmpPosX + (Math.cos(AgentDisplay._tmpAngle + AGENT_FOV_HALF_RADS) * AGENT_FOV_RANGE),
      AgentDisplay._tmpPosY + (Math.sin(AgentDisplay._tmpAngle + AGENT_FOV_HALF_RADS) * AGENT_FOV_RANGE)
    );

    // context.lineTo(Math.cos(AgentDisplay._tmpAngle) * SPATIAL_HASH_SIZE, Math.sin(AgentDisplay._tmpAngle) * SPATIAL_HASH_SIZE);
    context.fillStyle = 'rgba(0,0,255,0.15)';
    context.fill();
    context.closePath();
  }

  public draw(agents: (DisplayTrait & MotionTrait)[], agentCount: number, render3D: 0 | 1 = 1) {
    // agents = agents.sort(depthSort);
    this.context.clearRect(0, 0, this.width, this.height);

    // this.context.fillStyle = 'rgba(255,255,255,0.025)';
    // this.context.fillRect(0, 0, this.width, this.height);

    let i = agentCount - 1;
    let currentAgent;
    while (i >= 0) {
      currentAgent = agents[i];
      this.context.beginPath();
      this.context.fillStyle = currentAgent.color;
      this.drawCircle2D(this.context, currentAgent);
      this.context.fill();
      this.context.closePath();

      // this.context.beginPath();
      // this.context.fillStyle = `rgba(0,0,255,0.25)`;
      // AgentDisplay.drawPOV(this.context, currentAgent);
      // this.context.fill();
      // this.context.closePath();


      i -= 1;
    }
  }
  public pointAt(pos: Vector, size: number = 4) {
    this.context.fillStyle = '#000';
    this.context.fillRect(pos[0] - (size / 2), pos[1] - (size / 2), size, size);
  }
}
