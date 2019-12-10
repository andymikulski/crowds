import Vector from '../etc/Vector2D';

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH_HALF,
  SCREEN_HEIGHT_HALF,
  WORLD_DEPTH_HALF,
} from "../config";
import { PositionTrait, MotionTrait, DisplayTrait } from '../traits';
import { FlockBehavior } from './Flock';
import { PhysicsBehavior } from './Behaviors/physics';
import { BoundaryBehavior } from './Behaviors/boundary';
import { FlowBehavior } from './Behaviors/flow';
import { WallBehavior } from './Behaviors/walls';
import { TerrainDisplay } from '../Display/TerrainDisplay';
import { FlowFieldData, FlowField } from './FlowField';
import { SlowingBehavior } from './Behaviors/slowing';

export type Agent = PositionTrait & MotionTrait & DisplayTrait;


export class AgentManager {

  public static WEIGHTS = {
    // flow: 0.3,
    // separate: 1.3,
    // align: 0.8,
    // cohesion: 0.0,
    flow: 0.5,
    separate: 1.0,
    align: 1.5,
    cohesion: 0.0,
  }

  public agents: Agent[] = [];
  public agentCount: number = 0;

  private wallBehavior: WallBehavior;
  private flowBehavior: FlowBehavior;
  constructor(terrain: TerrainDisplay, private flowField: FlowFieldData) {
    this.wallBehavior = new WallBehavior(terrain);
    this.flowBehavior = new FlowBehavior(flowField);
  }

  spawnAgent(index: number = 0, props: any = {}) {
    const angle = (index / 360) * (Math.PI / 180);
    const oddEven = Math.random() > 0.5 ? 1 : (Math.random() > 0.5 ? 2 : -1);
    const newWisp: Agent = {
      acceleration: new Vector([0, 0, 0]),
      position: new Vector([SCREEN_WIDTH * Math.random(), SCREEN_HEIGHT * Math.random(), WORLD_DEPTH_HALF]),
      velocity: new Vector([0, 0, 0]), // new Vector([Math.cos(angle), Math.sin(angle), 0]),
      color: oddEven === 1 ? '#f00' : (oddEven === 2 ? '#00f' : '#222'),
      size: 5,
      maxSpeed: (Math.max(0.75, Math.random() * 1)) * 0.5,
      currentSpeed: 1,
      maxForce: 0.25, // 125,
      ...props,
    };

    this.agents.push(newWisp);
    this.agentCount += 1;
  }

  getNeighboringAgents(agent: Agent) {
    // let area = Math.max(1, agent.currentSpeed) * 5;
    // area *= area;

    let area = 10 * 10;

    return this.agents.filter(ag => {
      return Vector.squaredDist(agent.position, ag.position) < area;
    });
  }

  updateAgent(agent: Agent) {
    this.wallBehavior.updateAgent(agent);

    let neighbors = this.getNeighboringAgents(agent);


    // Flocking
    agent.acceleration.addMultiple(
      this.flowBehavior.updateAgent(agent).mult(AgentManager.WEIGHTS.flow),
      // FlockBehavior.racism(agent, neighbors).mult(1.25),
      FlockBehavior.separate(agent, neighbors).mult(AgentManager.WEIGHTS.separate),
      FlockBehavior.align(agent, neighbors).mult(AgentManager.WEIGHTS.align),
      FlockBehavior.cohesion(agent, neighbors).mult(AgentManager.WEIGHTS.cohesion),
    );

    // Slowing
    // SlowingBehavior.updateAgent(agent, neighbors);

    // Motion
    PhysicsBehavior.updateAgent(agent);

    // console.log('asdf', agent, agent.position.values, agent.acceleration.values, agent.velocity.values);
    // throw new Error();
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