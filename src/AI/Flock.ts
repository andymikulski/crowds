import Vector from "../etc/Vector2D";
import { PositionTrait, MotionTrait, DisplayTrait } from "../traits";


const seperationBuffer = 15 * 15;
const neighborThreshold = 50 * 50;
const racismThreshold = 60 * 60;

export class FlockBehavior {

  public static racism(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    const sum: Vector = Vector.get();
    let count = 0;
    let speedDiff;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      speedDiff = currentAgent.velocity.squaredMagnitude() - other.velocity.squaredMagnitude();
      if (speedDiff < 5 && speedDiff > -5) {
        continue;
      }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if (d < racismThreshold) {
        // racism
        const diff: Vector = Vector.get(currentAgent.position).sub(other.position).sub(Math.random() * 10);
        diff.normalize();
        diff.mult(d);
        sum.add(diff);
        count++;

        Vector.free(diff);
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(currentAgent.currentSpeed);
      const steer = Vector.sub(sum, currentAgent.velocity).limit(currentAgent.maxForce);
      return steer;
    } else {
      return Vector.get();
    }
  }

  // Separation
  // Method checks for nearby boids and steers away
  public static separate(currentAgent: DisplayTrait & MotionTrait, agents: DisplayTrait[]): Vector {
    const steer: Vector = Vector.get();
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent) { continue; }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if ((d > 0) && (d < seperationBuffer)) {
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

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  public static align(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    const sum: Vector = Vector.get();
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      // if (other === currentAgent || other.color !== currentAgent.color) {
      //   continue;
      // }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if (d < neighborThreshold) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(currentAgent.currentSpeed);
      return Vector.sub(sum, currentAgent.velocity).limit(currentAgent.maxForce);
    }
    else {
      return Vector.get();
    }
  }

  // Cohesion
  // For the average position (i.e. center) of all nearby boids, calculate steering vector towards that position
  public static cohesion(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    const sum: Vector = Vector.get();   // Start with empty vector to accumulate all positions
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent) { continue; }
      // if (other.color !== currentAgent.color) {
      //   continue;
      // }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if (d < neighborThreshold) {
        sum.add(other.position); // Add position
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return FlockBehavior.seek(currentAgent, sum);  // Steer towards the position
    }
    else {
      return Vector.get();
    }
  }

  static seek(agent: DisplayTrait & MotionTrait, target: Vector): Vector {
    const desired: Vector = Vector.get(target);
    desired.sub(agent.position);  // A vector pointing from the position to the target

    // Scale to maximum speed
    desired.normalize();
    desired.mult(agent.currentSpeed);

    // Above two lines of code below could be condensed with new setMag:Vector() method
    // Not using this method until Processing.js catches up
    // desired.setMag(currentSpeed);

    // Steering = Desired minus Velocity
    const steering = Vector.get(desired);
    steering.sub(agent.velocity);
    steering.limit(agent.maxForce);  // Limit to maximum steering force
    return steering;
  }
}
