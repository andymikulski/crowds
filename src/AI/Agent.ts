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
import { PositionTrait, MotionTrait, DisplayTrait, ItemID } from '../traits';
import { FlockBehavior } from './Flock';
import { PhysicsBehavior } from './Behaviors/physics';
import { BoundaryBehavior } from './Behaviors/boundary';
import { FlowBehavior } from './Behaviors/flow';
import { WallBehavior } from './Behaviors/walls';
import { TerrainDisplay } from '../Display/TerrainDisplay';
import { FlowFieldData, FlowField } from './FlowField';
import { SlowingBehavior } from './Behaviors/slowing';
import { SpatialHash } from '../SpatialHash';

export type Agent = PositionTrait & MotionTrait & DisplayTrait;


export class AgentManager {

  public static WEIGHTS = AGENT_WEIGHTS;

  public locationHash: SpatialHash;

  public agents: Agent[] = [];
  public agentCount: number = 0;

  private wallBehavior: WallBehavior;
  private flowBehavior: FlowBehavior;
  constructor(private terrain: TerrainDisplay, private flowField: FlowFieldData) {
    this.wallBehavior = new WallBehavior(terrain);
    this.flowBehavior = new FlowBehavior(flowField);

    this.locationHash = new SpatialHash();
  }

  spawnAgent(index: number = 0, props: any = {}) {
    const angle = (index / 360) * (Math.PI / 180);
    const oddEven = Math.random() > 0.5 ? 1 : (Math.random() > 0.5 ? 2 : -1);
    const speed = (Math.max(MIN_SPEED, Math.random() * MAX_SPEED));
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
      id: Math.random().toString(36).slice(2),
      ...props,
    };

    this.agents.push(newWisp);
    this.locationHash.addToBucket(this.agentCount, newWisp.position);
    this.agentCount += 1;
  }

  private agentFilter(agent: Agent) {
    let area = 15 * 15;
    return (other: Agent) => {
      return other !== agent
        && VecMath.squaredDist(agent.position, other.position) < area
        && this.isInAgentsFOV(agent, other)
    };
  }

  getNearbyAgents(agent: Agent) {

    return this.locationHash.getNeighborsForPosition(agent.position)
      .map((neighborIdx: number) => {
        return this.agents[neighborIdx];
      });

    // let area = Math.max(1, agent.currentSpeed) * 5;
    // area *= area;
    // const filter = this.agentFilter(agent);
    // return this.agents.filter(filter);
  }

  isGenerallyHeadingSameDirection(agent: Agent, other: Agent) {
    // they have same oriented direction if their cross product is zero
    // and dot product is greater than zero.
    // let cross = VecMath.cross(agent.velocity, other.velocity) ;
    return VecMath.dot(agent.velocity, other.velocity) > 0
    // && cross > -0.05 && cross < 0.05;
  }

  isInAgentsFOV(agent: Agent, other: Agent) {
    //Prepare normalized vectors
    const currDirection: Vector = VecMath.normalize(agent.velocity);
    const dirTowardsOther: Vector = VecMath.normalize(VecMath.sub(other.position, agent.position));
    // const dirTowardsOther = currPos.sub(otherPos).normalize();

    //Check angle
    const angle = Math.acos(VecMath.dot(currDirection, dirTowardsOther)) * (180 / Math.PI);

    return isNaN(angle) ? false : angle > 45 && angle < 135;
  }

  private _neighbors: Agent[];
  private _forces: Vector[];

  updateAgent(agent: Agent) {
    this.wallBehavior.updateAgent(agent);

    this._neighbors = this.getNearbyAgents(agent);

    // this._forces = [
    //   VecMath.mult(this.flowBehavior.updateAgent(agent), AgentManager.WEIGHTS.flow),
    //   VecMath.mult(FlockBehavior.separate(agent, this._neighbors), AgentManager.WEIGHTS.separate),
    //   VecMath.mult(FlockBehavior.align(agent, this._neighbors), AgentManager.WEIGHTS.align),
    //   VecMath.mult(FlockBehavior.cohesion(agent, this._neighbors), AgentManager.WEIGHTS.cohesion),
    //   // WallBehavior.avoidWalls(agent).mult(AgentManager.WEIGHTS.avoidWalls),
    //   // FlockBehavior.racism(agent, neighbors).mult(AgentManager.WEIGHTS.racism),
    // ];

    // Flocking
    agent.acceleration = VecMath.addMultiple(agent.acceleration,
      VecMath.mult(this.flowBehavior.updateAgent(agent), AgentManager.WEIGHTS.flow),
      VecMath.mult(FlockBehavior.separate(agent, this._neighbors), AgentManager.WEIGHTS.separate),
      VecMath.mult(FlockBehavior.align(agent, this._neighbors), AgentManager.WEIGHTS.align),
      VecMath.mult(FlockBehavior.cohesion(agent, this._neighbors), AgentManager.WEIGHTS.cohesion)
    );

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
      this.locationHash.addToBuffer(i, this.agents[i].position);
      i -= 1;
    }
    this.locationHash.flip();
  }
};