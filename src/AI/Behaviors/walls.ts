import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";
import { TerrainDisplay } from "../../Display/TerrainDisplay";
import Vector from "../../etc/Vector2D";

export class WallBehavior {
  constructor(private terrain: TerrainDisplay) { }


  public static avoidWalls(currentAgent: DisplayTrait & MotionTrait, agents: DisplayTrait[]): Vector {
    const steer = Vector.get();
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent) { continue; }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if ((d > 0)) { // } && (d < seperationBuffer)) {
        // Calculate vector pointing away from neighbor
        const diff: Vector = Vector.get(currentAgent.position).sub(other.position);
        diff.normalize();

        diff.div(d);
        count++;            // Keep track of how many
        steer.add(diff);
        Vector.free(diff);
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.magnitude() > 0) {
      // First two lines of code below could be condensed with new setMag:Vector() method
      // Not using this method until Processing.js catches up
      // steer.setMag(currentSpeed);

      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(currentAgent.currentSpeed);
      steer.sub(currentAgent.velocity);
      steer.limit(currentAgent.maxForce);
    }

    return steer;
  }




  updateAgent(agent: DisplayTrait & MotionTrait) {
    const x = agent.position.values[0];
    const y = agent.position.values[1];
    const size = agent.size; //  * 0.5;

    if (!this.terrain.isWalkableAt(x + size, y)) {
      agent.acceleration.values[0] -= agent.currentSpeed * 2;
    }
    if (!this.terrain.isWalkableAt(x - size, y)) {
      agent.acceleration.values[0] += agent.currentSpeed * 2;
    }

    if (!this.terrain.isWalkableAt(x, y + size)) {
      agent.acceleration.values[1] -= agent.currentSpeed * 2;
    }
    if (!this.terrain.isWalkableAt(x, y - size)) {
      agent.acceleration.values[1] += agent.currentSpeed * 2;
    }
  }
}