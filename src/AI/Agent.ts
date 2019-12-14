import VecMath, { Vector2D } from '../etc/Vector2D';
type Vector = Vector2D;

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH_HALF,
  SCREEN_HEIGHT_HALF,
  WORLD_DEPTH_HALF,
  AGENT_SIZE,
  AGENT_WEIGHTS,
  MIN_SPEED,
  MAX_SPEED,
  MAX_FORCE,
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

  public static WEIGHTS = AGENT_WEIGHTS;

  public agents: Agent[] = [];
  public agentCount: number = 0;

  private wallBehavior: WallBehavior;
  private flowBehavior: FlowBehavior;
  constructor(private terrain: TerrainDisplay, private flowField: FlowFieldData) {
    this.wallBehavior = new WallBehavior(terrain);
    this.flowBehavior = new FlowBehavior(flowField);
  }

  spawnAgent(index: number = 0, props: any = {}) {
    const angle = (index / 360) * (Math.PI / 180);
    const oddEven = Math.random() > 0.5 ? 1 : (Math.random() > 0.5 ? 2 : -1);
    const speed =  (Math.max(MIN_SPEED, Math.random() * MAX_SPEED));
    let position;
    do {
      position = [SCREEN_WIDTH * Math.random(), SCREEN_HEIGHT * Math.random(), WORLD_DEPTH_HALF];
    } while (!this.terrain.isWalkableAt(position[0], position[1]))

    const newWisp: Agent = {
      acceleration: [0, 0, 0],
      position,
      velocity: [0, 0, 0], // VecMath.get([Math.cos(angle), Math.sin(angle), 0]),
      color: '#222', //  oddEven === 1 ? '#f00' : (oddEven === 2 ? '#00f' : '#222'),
      size: AGENT_SIZE,
      maxSpeed: speed,
      currentSpeed: speed,
      maxForce: MAX_FORCE, // 125,
      ...props,
    };

    this.agents.push(newWisp);
    this.agentCount += 1;
  }

  getNearbyAgents(agent: Agent) {
    // let area = Math.max(1, agent.currentSpeed) * 5;
    // area *= area;

    let area = 15 * 15;

    return this.agents.filter(other => {
      return other !== agent
        && VecMath.squaredDist(agent.position, other.position) < area
        && this.isInAgentsFOV(agent, other)
        // && this.isGenerallyHeadingSameDirection(agent, other);
    });
  }

  isGenerallyHeadingSameDirection(agent:Agent, other:Agent) {
    // they have same oriented direction if their cross product is zero
    // and dot product is greater than zero.
    // let cross = VecMath.cross(agent.velocity, other.velocity) ;
    return VecMath.dot(agent.velocity, other.velocity) > 0
      // && cross > -0.05 && cross < 0.05;
  }

  isInAgentsFOV(agent:Agent, other:Agent) {
    //Initialize starting vectors
    const currPos:Vector = [agent.position[0], agent.position[1]];
    const otherPos:Vector = [other.position[0], other.position[1]];

    //Prepare normalized vectors
    const currDirection:Vector = VecMath.normalize(agent.velocity);
    const dirTowardsOther:Vector = VecMath.normalize(VecMath.sub(otherPos, currPos));
    // const dirTowardsOther = currPos.sub(otherPos).normalize();

    //Check angle
    const angle = Math.acos(VecMath.dot(currDirection, dirTowardsOther));
    const angleInDegrees = angle * (180 / Math.PI);
    // throw angle * (180 / Math.PI);
    // debugger;
    // console.log(angleInDegrees)

    // VecMath.free(currPos, currDirection, otherPos, dirTowardsOther);

    return isNaN(angle) ? false : angleInDegrees > 45 && angleInDegrees < 135;
  }

  updateAgent(agent: Agent) {
    this.wallBehavior.updateAgent(agent);

    let neighbors = this.getNearbyAgents(agent);

    let forces = [
      VecMath.mult(this.flowBehavior.updateAgent(agent), AgentManager.WEIGHTS.flow),
      VecMath.mult(FlockBehavior.separate(agent, neighbors), AgentManager.WEIGHTS.separate),
      VecMath.mult(FlockBehavior.align(agent, neighbors), AgentManager.WEIGHTS.align),
      VecMath.mult(FlockBehavior.cohesion(agent, neighbors), AgentManager.WEIGHTS.cohesion),
      // WallBehavior.avoidWalls(agent).mult(AgentManager.WEIGHTS.avoidWalls),
      // FlockBehavior.racism(agent, neighbors).mult(AgentManager.WEIGHTS.racism),
    ];

    // Flocking
    agent.acceleration = VecMath.addMultiple(agent.acceleration, ...forces);

    // Slowing
    // SlowingBehavior.updateAgent(agent, neighbors);

    // Motion
    PhysicsBehavior.updateAgent(agent);

    // console.log('asdf', agent, agent.position, agent.acceleration, agent.velocity);
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