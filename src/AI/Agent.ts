import Vector from '../etc/Vector2D';

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH_HALF,
  SCREEN_HEIGHT_HALF,
  WORLD_DEPTH_HALF,
  AGENT_SIZE,
  AGENT_WEIGHTS,
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
    const speed =  (Math.max(0.15, Math.random() * 0.225));
    let position;
    do {
      position = Vector.get([SCREEN_WIDTH * Math.random(), SCREEN_HEIGHT * Math.random(), WORLD_DEPTH_HALF]);
    } while (!this.terrain.isWalkableAt(position.values[0], position.values[1]))

    const newWisp: Agent = {
      acceleration: Vector.get([0, 0, 0]),
      position,
      velocity: Vector.get([0, 0, 0]), // Vector.get([Math.cos(angle), Math.sin(angle), 0]),
      color: '#222', //  oddEven === 1 ? '#f00' : (oddEven === 2 ? '#00f' : '#222'),
      size: AGENT_SIZE,
      maxSpeed: speed,
      currentSpeed: speed,
      maxForce: 0.05, // 125,
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
        && Vector.squaredDist(agent.position, other.position) < area
        && this.isInAgentsFOV(agent, other)
        // && this.isGenerallyHeadingSameDirection(agent, other);
    });
  }

  isGenerallyHeadingSameDirection(agent:Agent, other:Agent) {
    // they have same oriented direction if their cross product is zero
    // and dot product is greater than zero.
    // let cross = Vector.cross(agent.velocity, other.velocity) ;
    return Vector.dot(agent.velocity, other.velocity) > 0
      // && cross > -0.05 && cross < 0.05;
  }

  isInAgentsFOV(agent:Agent, other:Agent) {
    //Initialize starting vectors
    const currPos = Vector.get(agent.position);
    const otherPos = Vector.get(other.position);

    //Prepare normalized vectors
    const currDirection = Vector.get(agent.velocity).normalize();
    const dirTowardsOther = otherPos.sub(currPos).normalize();
    // const dirTowardsOther = currPos.sub(otherPos).normalize();

    //Check angle
    const angle = Math.acos(Vector.dot(currDirection, dirTowardsOther));
    const angleInDegrees = angle * (180 / Math.PI);
    // throw angle * (180 / Math.PI);
    // debugger;
    // console.log(angleInDegrees)

    // Vector.free(currPos, currDirection, otherPos, dirTowardsOther);

    return isNaN(angle) ? false : angleInDegrees > 45 && angleInDegrees < 135;
  }

  updateAgent(agent: Agent) {
    this.wallBehavior.updateAgent(agent);

    let neighbors = this.getNearbyAgents(agent);

    let forces = [
      this.flowBehavior.updateAgent(agent).mult(AgentManager.WEIGHTS.flow),
      FlockBehavior.separate(agent, neighbors).mult(AgentManager.WEIGHTS.separate),
      FlockBehavior.align(agent, neighbors).mult(AgentManager.WEIGHTS.align),
      FlockBehavior.cohesion(agent, neighbors).mult(AgentManager.WEIGHTS.cohesion),
      // WallBehavior.avoidWalls(agent).mult(AgentManager.WEIGHTS.avoidWalls),
      // FlockBehavior.racism(agent, neighbors).mult(AgentManager.WEIGHTS.racism),
    ];

    // Flocking
    Vector.prototype.addMultiple.apply(agent.acceleration, forces);

    Vector.free.apply(Vector, forces);

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