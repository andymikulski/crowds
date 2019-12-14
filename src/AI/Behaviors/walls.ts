import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";
import { TerrainDisplay } from "../../Display/TerrainDisplay";
import VecMath, { Vector } from "../../etc/Vector2D";

export class WallBehavior {
  constructor(private terrain: TerrainDisplay) { }


  public static avoidWalls(currentAgent: DisplayTrait & MotionTrait, agents: DisplayTrait[]): Vector {
    let steer:Vector = [0,0];
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent) { continue; }

      const d: number = VecMath.squaredDist(currentAgent.position, other.position);
      if ((d > 0)) { // } && (d < seperationBuffer)) {
        // Calculate vector pointing away from neighbor
        let  diff: Vector = VecMath.sub(currentAgent.position, other.position);
        diff = VecMath.normalize(diff);
        diff = VecMath.div(diff, d);
        count++;            // Keep track of how many
        steer = VecMath.add(steer, diff);
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer = VecMath.div(steer, count);
    }

    // As long as the vector is greater than 0
    if (VecMath.magnitude(steer) > 0) {
      // First two lines of code below could be condensed with new setMag:Vector() method
      // Not using this method until Processing.js catches up
      // steer.setMag(currentSpeed);

      // Implement Reynolds: Steering = Desired - Velocity
      steer = VecMath.normalize(steer);
      steer = VecMath.mult(steer, currentAgent.currentSpeed);
      steer = VecMath.sub(steer, currentAgent.velocity);
      steer = VecMath.limit(steer, currentAgent.maxForce);
    }

    return steer;
  }




  updateAgent(agent: DisplayTrait & MotionTrait) {
    const x = agent.position[0];
    const y = agent.position[1];
    const size = agent.size; //  * 0.5;

    if (!this.terrain.isWalkableAt(x + size, y)) {
      agent.acceleration[0] -= agent.currentSpeed;
    }
    if (!this.terrain.isWalkableAt(x - size, y)) {
      agent.acceleration[0] += agent.currentSpeed;
    }

    if (!this.terrain.isWalkableAt(x, y + size)) {
      agent.acceleration[1] -= agent.currentSpeed;
    }
    if (!this.terrain.isWalkableAt(x, y - size)) {
      agent.acceleration[1] += agent.currentSpeed;
    }
  }
}