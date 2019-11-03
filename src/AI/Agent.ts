import Vector from '../etc/Vector2D';

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH_HALF,
  SCREEN_HEIGHT_HALF,
} from "../config";
import { PositionTrait, MotionTrait, DisplayTrait } from '../traits';
import { FlockBehavior } from './Flock';
import { PhysicsBehavior } from './Behaviors/physics';
import { BoundaryBehavior } from './Behaviors/boundary';
import { FlowBehavior } from './Behaviors/flow';
import { WallBehavior } from './Behaviors/walls';
import { TerrainDisplay } from '../Display/TerrainDisplay';

export type Agent = PositionTrait & MotionTrait & DisplayTrait;


export class AgentManager {
  public agents: Agent[] = [];
  public agentCount: number = 0;

  private wallBehavior: WallBehavior;
  constructor(terrain: TerrainDisplay) {
    this.wallBehavior = new WallBehavior(terrain);
  }

  spawnAgent(index: number = 0, props: any = {}) {
    const angle = (index / 360) * (Math.PI / 180);
    const oddEven = Math.random() > 0.5 ? 1 : (Math.random() > 0.5 ? 2 : -1);
    const newWisp: Agent = {
      acceleration: new Vector(),
      position: new Vector([250 + Math.random(), 500 + Math.random(), 5]),
      velocity: new Vector([Math.cos(angle), Math.sin(angle), 0]),
      color: oddEven === 1 ? '#f00' : (oddEven === 2 ? '#00f' : '#222'),
      size: 5,
      maxSpeed: Math.max(0.75, Math.random() * 1.5),
      maxForce: 0.15,
      ...props,
    };

    this.agents.push(newWisp);
    this.agentCount += 1;
  }

  updateAgent(agent: Agent) {
    this.wallBehavior.updateAgent(agent);

    // Flocking
    agent.acceleration.addMultiple(
      FlowBehavior.updateAgent(agent).mult(1.45),
      FlockBehavior.racism(agent, this.agents).mult(1.25),
      FlockBehavior.separate(agent, this.agents).mult(2.25), // 1.5),
      FlockBehavior.align(agent, this.agents).mult(0.8),
      FlockBehavior.cohesion(agent, this.agents).mult(0.8),
    );

    // Motion
    PhysicsBehavior.updateAgent(agent);

    // Lock agents inside the screen
    BoundaryBehavior.updateAgent(agent);

  }

  tick = () => {
    let i = this.agentCount - 1;
    while (i >= 0) {
      this.updateAgent(this.agents[i]);
      i -= 1;
    }
  }
};