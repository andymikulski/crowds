import VecMath, { Vector } from "../etc/Vector2D";
import { PositionTrait, MotionTrait, DisplayTrait } from "../traits";


const seperationBuffer = 15 * 15;
const neighborThreshold = 50 * 50;
const racismThreshold = 60 * 60;

export class FlockBehavior {

  public static racism(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    let sum: Vector = [0,0];
    let count = 0;
    let speedDiff;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      speedDiff = VecMath.squaredMagnitude(currentAgent.velocity) - VecMath.squaredMagnitude(other.velocity);
      if (speedDiff < 5 && speedDiff > -5) {
        continue;
      }

      const d: number = VecMath.squaredDist(currentAgent.position, other.position);
      // if (d < racismThreshold) {
        // racism
        let diff: Vector = VecMath.sub(currentAgent.position, other.position);
        diff = VecMath.sub(diff, Math.random() * 10);
        diff = VecMath.normalize(diff);
        diff =VecMath.mult(diff,d);
        sum = VecMath.add(sum, diff);
        count++;
      // }
    }

    if (count > 0) {
      sum = VecMath.div(sum,count);
      sum = VecMath.normalize(sum);
      sum = VecMath.mult(sum,currentAgent.currentSpeed);
      const steer = VecMath.limit(VecMath.sub(sum, currentAgent.velocity), currentAgent.maxForce);
      return steer;
    } else {
      return [0,0];
    }
  }

  // Separation
  // Method checks for nearby boids and steers away
  public static separate(currentAgent: DisplayTrait & MotionTrait, agents: DisplayTrait[]): Vector {
    let steer: Vector = [0,0];
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent) { continue; }

      const d: number = VecMath.squaredDist(currentAgent.position, other.position);
      if ((d > 0)){ // } && (d < seperationBuffer)) {
        // Calculate vector pointing away from neighbor
        let diff: Vector = VecMath.sub(currentAgent.position, other.position);
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

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  public static align(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    let sum: Vector = [0,0];
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      // if (other === currentAgent || other.color !== currentAgent.color) {
      //   continue;
      // }

      // const d: number = VecMath.squaredDist(currentAgent.position, other.position);
      // if (d < neighborThreshold) {
        sum = VecMath.add(sum, other.velocity);
        count++;
      // }
    }
    if (count > 0) {
      sum = VecMath.div(sum, count);
      sum = VecMath.normalize(sum);
      sum = VecMath.mult(sum, currentAgent.currentSpeed);

      return VecMath.limit(VecMath.sub(sum, currentAgent.velocity), currentAgent.maxForce);
    }
    else {
      return [0,0];
    }
  }

  // Cohesion
  // For the average position (i.e. center) of all nearby boids, calculate steering vector towards that position
  public static cohesion(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    let sum: Vector = [0,0];   // Start with empty vector to accumulate all positions
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent) { continue; }
      // if (other.color !== currentAgent.color) {
      //   continue;
      // }

      // const d: number = VecMath.squaredDist(currentAgent.position, other.position);
      // if (d < neighborThreshold) {
        sum = VecMath.add(sum, other.position); // Add position
        count++;
      // }
    }
    if (count > 0) {
      sum = VecMath.div(sum, count);
      return FlockBehavior.seek(currentAgent, sum);  // Steer towards the position
    }
    else {
      return [0,0];
    }
  }

  static seek(agent: DisplayTrait & MotionTrait, target: Vector): Vector {
    // A vector pointing from the position to the target
    let desired: Vector = VecMath.sub(target, agent.position);
    // Scale to maximum speed
    desired = VecMath.normalize(desired);
    desired = VecMath.mult(desired, agent.currentSpeed);

    // Steering = Desired minus Velocity
    let steering = VecMath.sub(desired, agent.velocity);
    // Limit to maximum steering force
    steering = VecMath.limit(steering, agent.maxForce);

    return steering;
  }
}
